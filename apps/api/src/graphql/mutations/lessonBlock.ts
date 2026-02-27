import { builder } from "@graphql/builder";
import {
  LessonBlocksCreateInput,
  LessonBlocksUpdateInput,
} from "@graphql/__generated__/inputs";
import { requireAdmin } from "@graphql/auth/requireAuth";

builder.mutationFields((t) => ({
  createLessonBlock: t.prismaField({
    type: "LessonBlocks",
    args: {
      input: t.arg({ type: LessonBlocksCreateInput, required: true }),
    },
    resolve: async (_query, _parent, args, context) => {
      context.auth.requireAuth();
      requireAdmin(context);

      return await context.prisma.lessonBlocks.create({
        data: args.input,
      });
    },
  }),

  updateLessonBlock: t.prismaField({
    type: "LessonBlocks",
    args: {
      input: t.arg({ type: LessonBlocksUpdateInput, required: true }),
    },
    resolve: async (_query, _parent, args, context) => {
      context.auth.requireAuth();
      requireAdmin(context);

      return await context.prisma.lessonBlocks.update({
        where: { id: args.input.id },
        data: args.input,
      });
    },
  }),

  publishLessonBlock: t.prismaField({
    type: "LessonBlocks",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_query, _parent, args, context) => {
      context.auth.requireAuth();
      requireAdmin(context);

      const lessonBlockId = String(args.id);

      return await context.prisma.lessonBlocks.update({
        where: { id: lessonBlockId },
        data: { status: "PUBLISHED" },
      });
    },
  }),

  deleteLessonBlock: t.prismaField({
    type: "LessonBlocks",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_query, _parent, args, context) => {
      context.auth.requireAuth();
      requireAdmin(context);

      const lessonBlockId = String(args.id);

      return await context.prisma.lessonBlocks.delete({
        where: { id: lessonBlockId },
      });
    },
  }),

  /**
   * Set (or clear) the media URL on a lesson block.
   *
   * This is a focused alternative to updateLessonBlock for the FileUpload
   * integration — the caller passes a plain string URL (or null to clear)
   * rather than the full Prisma-style nested update input.
   *
   * Used by: LessonBlockMediaEditor in the admin-dashboard after a successful
   * S3 upload (FileUpload.onUploadComplete → setLessonBlockUrl mutation).
   */
  setLessonBlockUrl: t.prismaField({
    type: "LessonBlocks",
    description: "Set or clear the media URL on a lesson block.",
    args: {
      id: t.arg.id({ required: true }),
      url: t.arg.string({
        required: false,
        description: "Public media URL to store. Pass null to clear.",
      }),
    },
    resolve: async (_query, _parent, args, context) => {
      context.auth.requireAuth();
      requireAdmin(context);

      return await context.prisma.lessonBlocks.update({
        where: { id: String(args.id) },
        data: { url: args.url ?? null },
      });
    },
  }),
}));
