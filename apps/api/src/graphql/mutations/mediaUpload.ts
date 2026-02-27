import { GraphQLError } from "graphql";
import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";
import { generatePresignedPutUrl } from "../../services/s3.service";

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------

/**
 * Shape of the object returned by getUploadUrl.
 * Using objectRef so Pothos knows this is not a Prisma model.
 */
const UploadUrlResult = builder.objectRef<{
  uploadUrl: string;
  publicUrl: string;
  key: string;
}>("UploadUrlResult");

builder.objectType(UploadUrlResult, {
  description:
    "Presigned credentials for a single direct-to-S3 file upload.",
  fields: (t) => ({
    /**
     * A short-lived (5 min) pre-signed S3 PUT URL.
     *
     * The browser should PUT the raw file bytes to this URL.
     * The URL is signed for the exact Content-Type and Content-Length declared
     * in the request, so S3 will reject uploads that don't match.
     */
    uploadUrl: t.exposeString("uploadUrl", {
      description: "Pre-signed S3 PUT URL. Valid for 5 minutes.",
    }),

    publicUrl: t.exposeString("publicUrl", {
      description:
        "Permanent public URL — save this to LessonBlock.url after upload.",
    }),

    /** S3 object key. Useful for debugging or future server-side deletes. */
    key: t.exposeString("key", {
      description: "S3 object key for the uploaded file.",
    }),
  }),
});

// ---------------------------------------------------------------------------
// Input enum
// ---------------------------------------------------------------------------

/**
 * Media category the upload will belong to.
 * Controls which validation rules (MIME types, size limits) apply.
 */
const MediaType = builder.enumType("MediaType", {
  description: "The category of media being uploaded.",
  values: {
    IMAGE: {
      value: "IMAGE",
      description:
        "Image file — accepted types: JPEG, PNG, GIF, WebP. Max 10 MB.",
    },
    VIDEO: {
      value: "VIDEO",
      description: "Video file — accepted types: MP4, WebM. Max 100 MB.",
    },
  },
});

// ---------------------------------------------------------------------------
// Mutation
// ---------------------------------------------------------------------------

builder.mutationFields((t) => ({
  /**
   * Request a short-lived presigned URL to upload a media file directly to S3.
   *
   * --- Why this pattern? ---
   * Files never travel through our ECS task.  The browser PUTs the bytes
   * straight to S3 using the signed URL.  That keeps the API server cheap,
   * stateless, and fast regardless of file size.
   *
   * --- Upload flow ---
   * 1. Call this mutation with the file metadata (name, MIME type, size).
   * 2. PUT the raw file bytes to `uploadUrl` from the browser.
   * 3. On HTTP 200 from S3, call `updateLessonBlock` (or your mutation of
   *    choice) and persist `publicUrl` into `LessonBlock.url`.
   *
   * --- Security ---
   * - Only authenticated admins may request upload URLs.
   * - MIME type and file size are validated server-side (mirrors client rules).
   * - The signed URL is bound to the exact Content-Type + Content-Length
   *   that was declared, so S3 rejects any tampering.
   */
  getUploadUrl: t.field({
    type: UploadUrlResult,
    description: "Generate a presigned S3 PUT URL for a direct media upload.",
    args: {
      /** Original filename, used to preserve the file extension in S3. */
      fileName: t.arg.string({
        required: true,
        description: "Original name of the file (e.g. banner.png).",
      }),
      /** MIME type of the file (e.g. image/jpeg, video/mp4). */
      mimeType: t.arg.string({
        required: true,
        description: "MIME type declared by the browser (e.g. image/jpeg).",
      }),
      /**
       * Byte length of the file, as reported by the browser's File API.
       * S3 embeds this in the signature, so mismatched uploads are rejected.
       */
      fileSize: t.arg.int({
        required: true,
        description: "File size in bytes.",
      }),
      /** Whether this is an image or a video (determines validation rules). */
      mediaType: t.arg({
        type: MediaType,
        required: true,
        description: "IMAGE | VIDEO — selects the correct validation rules.",
      }),
    },

    resolve: async (_parent, args, context) => {
      // --- Auth ---
      context.auth.requireAuth();
      requireAdmin(context);

      // --- Generate presigned URL (server validates type + size) ---
      try {
        return await generatePresignedPutUrl(
          args.mimeType,
          args.mediaType as "IMAGE" | "VIDEO",
          args.fileName,
          args.fileSize
        );
      } catch (err) {
        // Wrap service-layer errors in a user-visible GraphQL error
        throw new GraphQLError((err as Error).message, {
          extensions: { code: "MEDIA_VALIDATION_ERROR" },
        });
      }
    },
  }),
}));
