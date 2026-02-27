/**
 * FileUpload.tsx
 *
 * Drag-and-drop file upload component for images and videos.
 *
 * ### Upload flow (why it works this way)
 * 1. User picks / drops a file → immediate client-side preview + validation.
 * 2. Component calls the `getUploadUrl` GraphQL mutation to get a short-lived
 *    signed S3 PUT URL. The file itself never goes through our API server —
 *    that keeps the ECS task lean and avoids memory spikes on large videos.
 * 3. The browser PUTs the raw bytes directly to S3 using `XMLHttpRequest`.
 *    XHR is used (not fetch) because it has `progress` events that let us
 *    drive the progress bar accurately.
 * 4. On success, `onUploadComplete(publicUrl, mediaType)` is called so the
 *    parent can persist the URL to LessonBlock.url or quiz option metadata.
 *
 * ### Validation
 * Client-side validation mirrors the server-side rules in s3.service.ts:
 * - Images: JPEG · PNG · GIF · WebP   — max 10 MB
 * - Videos: MP4  · WebM               — max 100 MB
 * This provides instant feedback without a round-trip, while the server
 * re-validates to prevent bypassing the client.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
} from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiFilm,
  FiImage,
  FiRefreshCw,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";

// ---------------------------------------------------------------------------
// Constants — mirror s3.service.ts validation rules
// ---------------------------------------------------------------------------

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const VIDEO_MIME_TYPES = ["video/mp4", "video/webm"];
const IMAGE_MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const VIDEO_MAX_BYTES = 100 * 1024 * 1024; // 100 MB

const ACCEPT_ATTR: Record<AcceptProp, string> = {
  images: IMAGE_MIME_TYPES.join(","),
  videos: VIDEO_MIME_TYPES.join(","),
  all: [...IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES].join(","),
};

type AcceptProp = "images" | "videos" | "all";
type MediaType = "image" | "video";
type UploadStatus = "idle" | "uploading" | "done" | "error";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FileUploadProps {
  /**
   * Called after a successful S3 upload with the permanent public URL and the
   * detected media type. Persist the URL into LessonBlock.url or similar.
   */
  onUploadComplete: (url: string, mediaType: MediaType) => void;

  /** Restrict accepted categories. Defaults to "all" (images + videos). */
  accept?: AcceptProp;

  /**
   * Existing media URL — renders an initial preview in "done" state.
   * Useful when editing an existing lesson block that already has media.
   */
  value?: string;

  /** Disable all interactions. */
  disabled?: boolean;

  /** Extra Tailwind classes forwarded to the outermost wrapper. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Small GraphQL helper (no Apollo Client in admin-dashboard yet)
// ---------------------------------------------------------------------------

interface GetUploadUrlVars {
  fileName: string;
  mimeType: string;
  fileSize: number;
  mediaType: "IMAGE" | "VIDEO";
}

interface GetUploadUrlResult {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

/**
 * Call the `getUploadUrl` mutation and return its result.
 * Throws if the server returns a GraphQL error.
 */
async function fetchUploadUrl(
  vars: GetUploadUrlVars,
  authToken: string
): Promise<GetUploadUrlResult> {
  // API URL is controlled via the VITE_API_URL env variable.
  // Falls back to the local dev server.
  const apiUrl =
    (import.meta as unknown as { env: Record<string, string> }).env
      .VITE_API_URL ?? "http://localhost:4000";

  const query = /* GraphQL */ `
    mutation GetUploadUrl(
      $fileName: String!
      $mimeType: String!
      $fileSize: Int!
      $mediaType: MediaType!
    ) {
      getUploadUrl(
        fileName: $fileName
        mimeType: $mimeType
        fileSize: $fileSize
        mediaType: $mediaType
      ) {
        uploadUrl
        publicUrl
        key
      }
    }
  `;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ query, variables: vars }),
  });

  if (!response.ok) {
    throw new Error(
      `API request failed with HTTP ${response.status}: ${response.statusText}`
    );
  }

  const json = (await response.json()) as {
    data?: { getUploadUrl?: GetUploadUrlResult };
    errors?: Array<{ message: string }>;
  };

  if (json.errors?.length) {
    // Surface the first GraphQL error message to the user
    throw new Error(json.errors[0].message);
  }

  const result = json.data?.getUploadUrl;
  if (!result) {
    throw new Error("Unexpected empty response from getUploadUrl mutation.");
  }

  return result;
}

// ---------------------------------------------------------------------------
// XHR upload (needed for progress events)
// ---------------------------------------------------------------------------

/**
 * PUT a file to a pre-signed S3 URL, reporting upload progress.
 *
 * Fetch does NOT expose upload progress (only download progress).
 * XMLHttpRequest does via `xhr.upload.onprogress`, which is what drives the
 * progress bar.
 */
function xhrUpload(
  file: File,
  uploadUrl: string,
  onProgress: (percent: number) => void,
  signal: AbortSignal
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Forward XHR abort when the AbortSignal fires
    signal.addEventListener("abort", () => xhr.abort());

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(
          new Error(
            `S3 rejected the upload (HTTP ${xhr.status}). ` +
              "The signed URL may have expired — please try again."
          )
        );
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.onabort = () => reject(new Error("Upload cancelled."));

    // S3 requires a plain PUT to the presigned URL.
    // The Content-Type MUST match the one embedded in the URL signature.
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}

// ---------------------------------------------------------------------------
// Client-side validation
// ---------------------------------------------------------------------------

interface ValidationResult {
  ok: boolean;
  error?: string;
  mediaType?: MediaType;
}

function validateFile(file: File, accept: AcceptProp): ValidationResult {
  const isImage = IMAGE_MIME_TYPES.includes(file.type);
  const isVideo = VIDEO_MIME_TYPES.includes(file.type);

  // Type check
  if (accept === "images" && !isImage) {
    return {
      ok: false,
      error: `Only images are accepted here (JPEG, PNG, GIF, WebP). Got: ${file.type}`,
    };
  }
  if (accept === "videos" && !isVideo) {
    return {
      ok: false,
      error: `Only videos are accepted here (MP4, WebM). Got: ${file.type}`,
    };
  }
  if (!isImage && !isVideo) {
    return {
      ok: false,
      error: `Unsupported file type "${file.type}". Accepted: JPEG, PNG, GIF, WebP, MP4, WebM.`,
    };
  }

  // Size check
  if (isImage && file.size > IMAGE_MAX_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    return { ok: false, error: `Image is ${mb} MB — maximum allowed is 10 MB.` };
  }
  if (isVideo && file.size > VIDEO_MAX_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      ok: false,
      error: `Video is ${mb} MB — maximum allowed is 100 MB.`,
    };
  }

  return { ok: true, mediaType: isImage ? "image" : "video" };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FileUpload({
  onUploadComplete,
  accept = "all",
  value,
  disabled = false,
  className = "",
}: FileUploadProps) {
  // --- State ---
  const [status, setStatus] = useState<UploadStatus>(() =>
    value ? "done" : "idle"
  );
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(value);
  const [previewMediaType, setPreviewMediaType] = useState<
    MediaType | undefined
  >(() => {
    if (!value) return undefined;
    // Guess from URL extension — good enough for initial render
    return /\.(mp4|webm)$/i.test(value) ? "video" : "image";
  });
  const [error, setError] = useState<string | undefined>();
  const [isDragOver, setIsDragOver] = useState(false);

  // --- Refs ---
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const objectUrlRef = useRef<string | undefined>(undefined); // track blob URL for cleanup

  const { user } = useAuth();

  // Revoke object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Core upload handler
  // ---------------------------------------------------------------------------

  const startUpload = useCallback(
    async (file: File) => {
      // 1. Client-side validation
      const validation = validateFile(file, accept);
      if (!validation.ok) {
        setError(validation.error);
        setStatus("error");
        return;
      }

      const mediaType = validation.mediaType!;

      // 2. Create a local preview URL immediately so the user sees feedback
      const objUrl = URL.createObjectURL(file);
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = objUrl;
      setPreviewUrl(objUrl);
      setPreviewMediaType(mediaType);
      setError(undefined);
      setProgress(0);
      setStatus("uploading");

      // 3. Get auth token
      let token: string;
      try {
        token = (await user?.getIdToken()) ?? "";
        if (!token) throw new Error("Not authenticated — please log in again.");
      } catch {
        setError("Could not retrieve authentication token.");
        setStatus("error");
        return;
      }

      // 4. Request presigned URL from the API
      let uploadUrl: string;
      let publicUrl: string;
      try {
        const result = await fetchUploadUrl(
          {
            fileName: file.name,
            mimeType: file.type,
            fileSize: file.size,
            mediaType: mediaType === "image" ? "IMAGE" : "VIDEO",
          },
          token
        );
        uploadUrl = result.uploadUrl;
        publicUrl = result.publicUrl;
      } catch (err) {
        setError((err as Error).message);
        setStatus("error");
        return;
      }

      // 5. PUT file directly to S3
      abortRef.current = new AbortController();
      try {
        await xhrUpload(file, uploadUrl, setProgress, abortRef.current.signal);
      } catch (err) {
        setError((err as Error).message);
        setStatus("error");
        return;
      }

      // 6. Swap the blob URL preview for the permanent public URL
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = undefined;
      }
      setPreviewUrl(publicUrl);
      setStatus("done");
      onUploadComplete(publicUrl, mediaType);
    },
    [accept, user, onUploadComplete]
  );

  // ---------------------------------------------------------------------------
  // Drag-and-drop handlers
  // ---------------------------------------------------------------------------

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      if (disabled || status === "uploading") return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      setIsDragOver(true);
    },
    [disabled, status]
  );

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    // Only clear drag state when leaving the component entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      if (disabled || status === "uploading") return;
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) void startUpload(file);
    },
    [disabled, status, startUpload]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) void startUpload(file);
      // Reset input so the same file can be re-selected if needed
      e.target.value = "";
    },
    [startUpload]
  );

  const handleReset = useCallback(() => {
    // Cancel in-flight upload if any
    abortRef.current?.abort();
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = undefined;
    }
    setStatus("idle");
    setPreviewUrl(undefined);
    setPreviewMediaType(undefined);
    setProgress(0);
    setError(undefined);
  }, []);

  // ---------------------------------------------------------------------------
  // Derived helpers
  // ---------------------------------------------------------------------------

  const isInteractive = !disabled && status !== "uploading";

  const dropZoneLabel =
    accept === "images"
      ? "Drop image here or click to browse"
      : accept === "videos"
        ? "Drop video here or click to browse"
        : "Drop image or video here, or click to browse";

  const acceptedFormatsHint =
    accept === "images"
      ? "JPEG, PNG, GIF, WebP — max 10 MB"
      : accept === "videos"
        ? "MP4, WebM — max 100 MB"
        : "Images (max 10 MB) · Videos (max 100 MB)";

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  function renderPreview() {
    if (!previewUrl) return null;

    if (previewMediaType === "video") {
      return (
        <video
          src={previewUrl}
          className="w-full max-h-64 rounded-lg object-contain bg-black"
          controls
          preload="metadata"
          aria-label="Uploaded video preview"
        />
      );
    }

    return (
      <img
        src={previewUrl}
        alt="Uploaded image preview"
        className="w-full max-h-64 rounded-lg object-contain bg-zinc-50"
      />
    );
  }

  function renderProgressBar() {
    return (
      <div
        className="w-full mt-3"
        role="progressbar"
        title={`Upload progress: ${progress}%`}
        {...{ 'aria-valuenow': progress, 'aria-valuemin': 0, 'aria-valuemax': 100 }}
      >
        <div className="flex justify-between text-xs text-zinc-500 mb-1">
          <span>Uploading…</span>
          <span>{progress}%</span>
        </div>
        {/*
          SVG is used here intentionally. The fill bar `width` is an SVG
          presentation attribute (not a CSS `style` property), so it avoids
          the react-dom/no-inline-styles lint rule while still being dynamic.
        */}
        <svg
          className="w-full"
          height="8"
          viewBox="0 0 100 8"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <rect x="0" y="0" width="100" height="8" rx="4" className="fill-zinc-200" />
          <rect
            x="0"
            y="0"
            width={progress}
            height="8"
            rx="4"
            className="fill-indigo-500"
          />
        </svg>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => isInteractive && inputRef.current?.click()}
        role="button"
        tabIndex={isInteractive ? 0 : -1}
        onKeyDown={(e) => {
          if (isInteractive && (e.key === "Enter" || e.key === " ")) {
            inputRef.current?.click();
          }
        }}
        aria-label={dropZoneLabel}
        // eslint-disable-next-line react-dom/no-missing-button-type
        {...{ 'aria-disabled': isInteractive ? 'false' : 'true' }}
        className={[
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors",
          isInteractive ? "cursor-pointer" : "cursor-default",
          isDragOver
            ? "border-indigo-400 bg-indigo-50"
            : status === "error"
              ? "border-red-300 bg-red-50"
              : status === "done"
                ? "border-green-300 bg-green-50"
                : "border-zinc-300 bg-zinc-50 hover:border-indigo-300 hover:bg-indigo-50/40",
        ].join(" ")}
      >
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR[accept]}
          className="sr-only"
          disabled={!isInteractive}
          onChange={handleInputChange}
          aria-hidden="true"
        />

        {/* Icon */}
        <div className="mb-3 text-4xl">
          {status === "done" ? (
            previewMediaType === "video" ? (
              <FiFilm className="text-green-500" />
            ) : (
              <FiImage className="text-green-500" />
            )
          ) : status === "error" ? (
            <FiAlertCircle className="text-red-400" />
          ) : (
            <FiUploadCloud
              className={isDragOver ? "text-indigo-500" : "text-zinc-400"}
            />
          )}
        </div>

        {/* Label text */}
        {status === "idle" && (
          <>
            <p className="text-sm font-medium text-zinc-700">{dropZoneLabel}</p>
            <p className="mt-1 text-xs text-zinc-400">{acceptedFormatsHint}</p>
          </>
        )}

        {status === "uploading" && (
          <p className="text-sm font-medium text-zinc-600">
            Uploading, please wait…
          </p>
        )}

        {status === "done" && (
          <p className="text-sm font-medium text-green-700">
            <FiCheckCircle className="inline mr-1" />
            Upload complete
          </p>
        )}

        {status === "error" && (
          <p className="text-sm font-medium text-red-600">{error}</p>
        )}
      </div>

      {/* Progress bar (visible only while uploading) */}
      {status === "uploading" && renderProgressBar()}

      {/* Media preview */}
      {previewUrl && status !== "uploading" && (
        <div className="relative">
          {renderPreview()}

          {/* Replace / clear buttons */}
          <div className="absolute top-2 right-2 flex gap-1">
            {isInteractive && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                  title="Replace file"
                  className="rounded-full bg-white/90 p-1.5 shadow hover:bg-white transition-colors"
                >
                  <FiRefreshCw size={14} className="text-zinc-600" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  title="Remove"
                  className="rounded-full bg-white/90 p-1.5 shadow hover:bg-white transition-colors"
                >
                  <FiX size={14} className="text-zinc-600" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Error retry hint */}
      {status === "error" && (
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          <FiRefreshCw size={14} />
          Try again
        </button>
      )}
    </div>
  );
}

export default FileUpload;
