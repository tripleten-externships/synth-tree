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

      const rawId = args.input.id;

      const blockId = typeof rawId === "string"
        ? rawId
        : typeof rawId === "object" && rawId !== null && "set" in rawId && typeof rawId.set === "string"
        ? rawId.set
        : undefined;

      const { id: _id, ...updateInput } = args.input;
      const data = Object.fromEntries(
        Object.entries(updateInput).map(([field, value]) => {
          if (value && typeof value === "object" && "set" in value) {
            return [field, value.set];
          }

          return [field, value];
        }),
      );

      return await context.prisma.lessonBlocks.update({
        where: { id: blockId! },
        data,
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

  reorderLessonBlocks: t.prismaField({
    type: ["LessonBlocks"],
    args: {
      nodeId: t.arg.id({ required: true }),
      orderedBlockIds: t.arg.idList({ required: true }),
    },
    resolve: async (query, _parent, args, context) => {
      context.auth.requireAuth();
      requireAdmin(context);

      const nodeId = String(args.nodeId);
      const orderedBlockIds = args.orderedBlockIds.map((id) => String(id));

      // Persist the new order for every block in a single transaction so a
      // partial failure never leaves the lesson with an inconsistent order.
      // updateMany is scoped by nodeId so ids from other nodes are ignored.
      await context.prisma.$transaction(
        orderedBlockIds.map((blockId, index) =>
          context.prisma.lessonBlocks.updateMany({
            where: { id: blockId, nodeId },
            data: { order: index },
          }),
        ),
      );

      return context.prisma.lessonBlocks.findMany({
        ...query,
        where: { nodeId },
        orderBy: [{ order: "asc" }],
      });
    },
  }),
}));
