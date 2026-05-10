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
}));
