/**
 * LessonBlockMediaEditor.tsx
 *
 * Wraps FileUpload and persists the resulting S3 URL to a LessonBlock via
 * the `setLessonBlockUrl` GraphQL mutation.
 *
 * ### Usage
 * ```tsx
 * <LessonBlockMediaEditor
 *   lessonBlockId="uuid-..."
 *   contentType="IMAGE"            // or "VIDEO"
 *   currentUrl={block.url ?? undefined}
 *   onSaved={(url) => refetchLesson()}
 * />
 * ```
 *
 * Integration: ST-70 (FileUpload) + ST-109 (media URL inputs)
 */

import { useState, useCallback } from "react";
import { FileUpload } from "../../components/FileUpload";
import { useAuth } from "../../hooks/useAuth";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ContentType = "IMAGE" | "VIDEO" | "EMBED" | "HTML";

export interface LessonBlockMediaEditorProps {
  /** ID of the LessonBlock to update after a successful upload. */
  lessonBlockId: string;

  /**
   * The block's content type. Determines which file types FileUpload accepts.
   * EMBED and HTML blocks don't use file upload — this component renders
   * nothing for those types.
   */
  contentType: ContentType;

  /** Existing URL to show as the initial preview (edit mode). */
  currentUrl?: string;

  /**
   * Called after the URL has been persisted to the LessonBlock.
   * Useful for triggering a refetch or updating local state in the parent.
   */
  onSaved?: (url: string) => void;

  /** Called when an error occurs during either upload or save. */
  onError?: (message: string) => void;
}

// ---------------------------------------------------------------------------
// GraphQL helper
// ---------------------------------------------------------------------------

const SET_LESSON_BLOCK_URL = /* GraphQL */ `
  mutation SetLessonBlockUrl($id: ID!, $url: String) {
    setLessonBlockUrl(id: $id, url: $url) {
      id
      url
      type
    }
  }
`;

async function callSetLessonBlockUrl(
  id: string,
  url: string,
  authToken: string
): Promise<void> {
  const apiUrl =
    (import.meta as unknown as { env: Record<string, string> }).env
      .VITE_API_URL ?? "http://localhost:4000";

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      query: SET_LESSON_BLOCK_URL,
      variables: { id, url },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `API request failed (HTTP ${response.status}): ${response.statusText}`
    );
  }

  const json = (await response.json()) as {
    data?: { setLessonBlockUrl?: { id: string } };
    errors?: Array<{ message: string }>;
  };

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  if (!json.data?.setLessonBlockUrl) {
    throw new Error("Unexpected empty response from setLessonBlockUrl.");
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LessonBlockMediaEditor({
  lessonBlockId,
  contentType,
  currentUrl,
  onSaved,
  onError,
}: LessonBlockMediaEditorProps) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [savedUrl, setSavedUrl] = useState<string | undefined>(currentUrl);

  // EMBED / HTML blocks have no file upload UI
  if (contentType === "EMBED" || contentType === "HTML") return null;

  const accept = contentType === "IMAGE" ? "images" : "videos";

  const handleUploadComplete = useCallback(
    async (publicUrl: string) => {
      setSaving(true);
      try {
        const token = (await user?.getIdToken()) ?? "";
        if (!token) throw new Error("Not authenticated — please log in again.");

        await callSetLessonBlockUrl(lessonBlockId, publicUrl, token);
        setSavedUrl(publicUrl);
        onSaved?.(publicUrl);
      } catch (err) {
        const message = (err as Error).message;
        onError?.(message);
        console.error("[LessonBlockMediaEditor] save failed:", message);
      } finally {
        setSaving(false);
      }
    },
    [lessonBlockId, user, onSaved, onError]
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-700">
        {contentType === "IMAGE" ? "Image" : "Video"}
      </label>

      <FileUpload
        accept={accept}
        value={savedUrl}
        onUploadComplete={handleUploadComplete}
        disabled={saving}
      />

      {saving && (
        <p className="text-xs text-zinc-500 animate-pulse">
          Saving URL to lesson block…
        </p>
      )}

      {savedUrl && !saving && (
        <p className="text-xs text-green-600 break-all">
          Saved:{" "}
          <a
            href={savedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-green-800"
          >
            {savedUrl}
          </a>
        </p>
      )}
    </div>
  );
}

export default LessonBlockMediaEditor;
