import { builder } from "@graphql/builder";
import type { GraphQLContext } from "@graphql/context";
import { CreateLessonBlockInput, UpdateLessonBlockInput } from "./block.inputs";
import { ContentType } from "@prisma/client";

builder.mutationField("createLessonBlock", (t) =>
  t.prismaField({
    type: "LessonBlocks",
    args: {
      input: t.arg({ type: CreateLessonBlockInput, required: true }),
    },
    resolve: async (_query, _parent, { input }, ctx: GraphQLContext) => {
      const userId = ctx.auth.requireAuth();

      await ctx.prisma.skillNode.findUniqueOrThrow({
        where: { id: input.nodeId },
      });

      return ctx.prisma.lessonBlocks.create({
        data: {
          nodeId: input.nodeId,
          type: input.type as ContentType,
          url: input.url ?? null,
          html: input.html ?? null,
          caption: input.caption ?? null,
          order: input.order,
        },
      });
    },
  })
);

builder.mutationField("updateLessonBlock", (t) =>
  t.prismaField({
    type: "LessonBlocks",
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdateLessonBlockInput, required: true }),
    },
    resolve: async (_query, _parent, { id, input }, ctx: GraphQLContext) => {
      ctx.auth.requireAuth();

      return ctx.prisma.lessonBlocks.update({
        where: { id },
        data: {
          type: (input.type as ContentType) ?? undefined,
          url: input.url ?? undefined,
          html: input.html ?? undefined,
          caption: input.caption ?? undefined,
          order: input.order ?? undefined,
        },
      });
    },
  })
);

builder.mutationField("deleteLessonBlock", (t) =>
  t.prismaField({
    type: "LessonBlocks",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_query, _parent, { id }, ctx: GraphQLContext) => {
      ctx.auth.requireAuth();

      return ctx.prisma.lessonBlocks.delete({
        where: { id },
      });
    },
  })
);

builder.mutationField("publishLessonBlock", (t) =>
  t.prismaField({
    type: "LessonBlocks",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_query, _parent, { id }, ctx: GraphQLContext) => {
      ctx.auth.requireAuth();

      return ctx.prisma.lessonBlocks.update({
        where: { id },
        data: { status: "PUBLISHED" },
      });
    },
  })
);
