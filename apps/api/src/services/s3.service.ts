import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import path from "path";

// ---------------------------------------------------------------------------
// S3 client
// ---------------------------------------------------------------------------

/**
 * Build an S3 client from environment variables.
 *
 * In production (ECS Fargate) the task role provides credentials automatically
 * via the instance metadata service, so we do NOT need to set
 * AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY in that environment.
 *
 * In local dev you can either:
 *   - set AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY in .env, or
 *   - run `aws configure` and let the SDK find the credentials file.
 */
const s3Client = new S3Client({
  region: process.env.AWS_REGION ?? "us-east-1",
  // Credentials are picked up automatically from the environment chain.
  // Explicit key/secret only needed when env vars are set.
  ...(process.env.AWS_ACCESS_KEY_ID && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  }),
});

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/** S3 bucket that holds media uploads. Must be set in all environments. */
const MEDIA_BUCKET = process.env.MEDIA_BUCKET_NAME ?? "";

/**
 * Public base URL for the bucket.
 *
 * This is the CloudFront distribution URL (or the raw S3 URL in dev).
 * Example: https://media.synth-tree.com  or  https://<bucket>.s3.amazonaws.com
 */
const MEDIA_PUBLIC_BASE_URL = (
  process.env.MEDIA_PUBLIC_BASE_URL ?? ""
).replace(/\/$/, ""); // strip trailing slash

// ---------------------------------------------------------------------------
// Validation rules
// ---------------------------------------------------------------------------

/** Accepted MIME types per media category */
const ALLOWED_MIME: Record<"IMAGE" | "VIDEO", string[]> = {
  IMAGE: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  VIDEO: ["video/mp4", "video/webm"],
};

/** Maximum allowed file sizes in bytes */
const MAX_BYTES: Record<"IMAGE" | "VIDEO", number> = {
  IMAGE: 10 * 1024 * 1024, // 10 MB
  VIDEO: 100 * 1024 * 1024, // 100 MB
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Validate that a file matches the allowed type and size for its media category.
 *
 * Throws a descriptive Error on failure so the GraphQL resolver can wrap it
 * in a user-facing GraphQLError.
 *
 * @param mimeType  - MIME type of the file (e.g. "image/jpeg")
 * @param fileSize  - Size in bytes
 * @param mediaType - "IMAGE" | "VIDEO"
 */
export function validateMediaFile(
  mimeType: string,
  fileSize: number,
  mediaType: "IMAGE" | "VIDEO"
): void {
  const allowed = ALLOWED_MIME[mediaType];
  if (!allowed.includes(mimeType)) {
    throw new Error(
      `File type "${mimeType}" is not allowed for ${mediaType}. ` +
        `Accepted types: ${allowed.join(", ")}`
    );
  }

  const maxBytes = MAX_BYTES[mediaType];
  if (fileSize > maxBytes) {
    const maxMB = maxBytes / (1024 * 1024);
    throw new Error(
      `File size (${(fileSize / (1024 * 1024)).toFixed(1)} MB) exceeds ` +
        `the ${maxMB} MB limit for ${mediaType} uploads.`
    );
  }
}

// ---------------------------------------------------------------------------
// Presigned URL generation
// ---------------------------------------------------------------------------

export interface PresignedUploadResult {
  /** Short-lived PUT URL the browser should use to upload the file directly */
  uploadUrl: string;
  /** Permanent public URL to persist in LessonBlock.url */
  publicUrl: string;
  /** S3 object key — useful for debugging or future deletes */
  key: string;
}

/**
 * Generate a presigned S3 PUT URL for a new media upload.
 *
 * Flow (why we do it this way):
 *   1. The browser asks the API for an `uploadUrl` (this function produces it).
 *   2. The browser PUTs the file byte-for-byte directly to S3 using that URL.
 *      The file never travels through our API server, so the ECS task stays
 *      cheap and stateless.
 *   3. After the PUT succeeds, the browser saves `publicUrl` to the relevant
 *      LessonBlock via the normal GraphQL mutation.
 *
 * The signed URL is valid for 5 minutes. After expiry, S3 rejects the PUT and
 * the browser re-requests a fresh URL.
 *
 * @param mimeType    - MIME type of the file (e.g., "video/mp4")
 * @param mediaType   - "IMAGE" | "VIDEO" (determines folder + validation)
 * @param originalName - Original filename from the browser (used for extension)
 * @param fileSize    - Byte length declared by the browser (validated server-side)
 */
export async function generatePresignedPutUrl(
  mimeType: string,
  mediaType: "IMAGE" | "VIDEO",
  originalName: string,
  fileSize: number
): Promise<PresignedUploadResult> {
  // 1. Server-side validation (mirrors the client-side checks)
  validateMediaFile(mimeType, fileSize, mediaType);

  // 2. Build a unique S3 key so files never collide
  const ext =
    path.extname(originalName).toLowerCase() ||
    `.${mimeType.split("/")[1] ?? "bin"}`;
  const folder = mediaType === "IMAGE" ? "images" : "videos";
  const key = `uploads/${folder}/${randomUUID()}${ext}`;

  // 3. Generate the presigned PUT command
  //
  //    ContentLength is embedded in the signature so a browser cannot upload
  //    a larger file than was declared (S3 rejects mismatched content lengths).
  const command = new PutObjectCommand({
    Bucket: MEDIA_BUCKET,
    Key: key,
    ContentType: mimeType,
    ContentLength: fileSize,
    // Prevent the bucket policy from being overridden by the uploader
    ACL: "public-read",
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 300, // 5 minutes — plenty for a single upload
  });

  const publicUrl = `${MEDIA_PUBLIC_BASE_URL}/${key}`;

  return { uploadUrl, publicUrl, key };
}
