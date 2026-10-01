import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";
import { GraphQLError } from "graphql";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const s3Client = new S3Client({});

export const ImageUploadUrlRef = builder.objectRef<{
  uploadUrl: string;
  objectUrl: string;
}>("ImageUploadUrlPayload");

builder.objectType(ImageUploadUrlRef, {
  fields: (t) => ({
    uploadUrl: t.string({
      nullable: false,
      resolve: (parent) => parent.uploadUrl,
    }),
    objectUrl: t.string({
      nullable: false,
      resolve: (parent) => parent.objectUrl,
    }),
  }),
});

builder.mutationFields((t) => ({
  requestImageUploadUrl: t.field({
    type: ImageUploadUrlRef,
    args: {
      fileName: t.arg.string({ required: true }),
      contentType: t.arg.string({ required: true }),
      fileSize: t.arg.int({ required: true }),
    },
    resolve: async (_parent, args, context) => {
      context.auth.requireAuth();
      requireAdmin(context);
      if (!ALLOWED_IMAGE_TYPES.includes(args.contentType)) {
        throw new GraphQLError("Unsupported image type");
      }
      const MAX_FILE_SIZE = 5 * 1024 * 1024;

      if (args.fileSize <= 0 || args.fileSize > MAX_FILE_SIZE) {
        throw new GraphQLError("Image must be larger than 0 bytes and 5 MB or smaller");
      }
      const bucketName = process.env.LESSON_ASSETS_BUCKET_NAME;
      if (!bucketName) {
        throw new GraphQLError("Lesson assets bucket is not configured");
      }
      const cloudFrontDomain =
        process.env.LESSON_ASSETS_CLOUDFRONT_DOMAIN;

      if (!cloudFrontDomain) {
        throw new GraphQLError("Lesson assets CloudFront domain is not configured");
      }
      const safeFileName = args.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
      const objectKey = `lesson-assets/${randomUUID()}-${safeFileName}`;
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        ContentType: args.contentType,
      });
      const uploadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 300,
      });
      const objectUrl = `https://${cloudFrontDomain}/${objectKey}`;
      return {
        uploadUrl,
        objectUrl,
      };
    },

  }),
}));
