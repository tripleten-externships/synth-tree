import { builder } from "@graphql/builder"
import { prisma } from "@lib/prisma";

builder.queryField("lesson", (t) =>
  t.prismaField({
    type: "Lesson",
    args: { id: t.arg.id({ required: true }) },
    resolve: async (query, _parent, args, context) => {
      if (!context.user) throw new Error("Unauthorized");
      const lesson = await prisma.lesson.findUnique({
        ...query,
        where: { id: args.id },
      });
      if (!lesson || !lesson.published)
        throw new Error("Lesson not found or unpublished");
      return lesson;
    },
  })
);

builder.queryField("lessons", (t) =>
  t.prismaField({
    type: ["Lesson"],
    args: {
      limit: t.arg.int(),
      offset: t.arg.int(),
    },
    resolve: async (query, _parent, args, context) => {
      if (!context.user) throw new Error("Unauthorized");
      return prisma.lesson.findMany({
        ...query,
        skip: args.offset ?? 0,
        take: args.limit ?? 10,
        where: { published: true },
      });
    },
  })
);

builder.queryField("lessonsByAuthor", (t) =>
  t.prismaField({
    type: ["Lesson"],
    args: { authorId: t.arg.string({ required: true }) },
    resolve: async (query, _parent, args, context) => {
      if (!context.user) throw new Error("Unauthorized");
      return prisma.lesson.findMany({
        ...query,
        where: { authorId: args.authorId, published: true },
      });
    },
  })
);
