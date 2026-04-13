import {builder} from "../builder";
import { getPresignedUploadUrls, getPublicUrl } from "src/s3";
import { requireAdmin } from "@graphql/auth/requireAuth";
import { randomUUID } from "crypto";
import path from "path";


const PresignedUploadUrlsMutation = builder.objectType(
  builder.objectRef<{
    uploadUrl: string;
    fileKey: string;
    publicUrl: string;
  }>("PresignedUploadPayload"),
  {
    fields: (t) => ({
      uploadUrl: t.exposeString("uploadUrl"),
      fileKey: t.exposeString("fileKey"),
      publicUrl: t.exposeString("publicUrl"),
    }),
  }
);

builder.mutationFields((t) => ({
    getUploadUrls: t.field({
        type: PresignedUploadUrlsMutation,
        args: {
          fileName: t.arg.string({ required: true }),
          contentType: t.arg.string({ required: true }),
          fileSize: t.arg.int({ required: true }),
        },
        resolve: async (_parent, args, context) => {
            context.auth.requireAuth();
            requireAdmin(context);

            const userId = context.auth.getUserId();
            const ext = path.extname(args.fileName).toLowerCase();
          const fileKey = `uploads/${userId}/${randomUUID()}/${ext}`;
 
          const { putObjectUrl }  = await getPresignedUploadUrls(fileKey, args.contentType, args.fileSize);
          const publicUrl = await getPublicUrl(fileKey);
          return { uploadUrl: putObjectUrl, fileKey, publicUrl };
        },
    }),
}));