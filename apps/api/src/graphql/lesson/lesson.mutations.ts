import { builder } from "@graphql/builder";
import { prisma } from "@lib/prisma";
import {
  CreateLessonInput,
  UpdateLessonInput,
} from "@graphql/lesson/lesson.inputs";

builder.mutationField("createLesson", (t) =>
  t.prismaField({
    type: "Lesson",
    args: {
      input: t.arg({ type: CreateLessonInput }),
    },
    resolve: async (query, _parent, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const input = args.input;

      if (!input) {
        throw new Error("Input is required");
      }

      const { title, content } = input;

      if (!title || !content) {
        throw new Error("Title and content are required");
      }

      const lesson = await prisma.lesson.create({
        ...query,
        data: {
          title,
          content,
          authorId: context.user.uid,
          published: false,
        },
      });

      return lesson;
    },
  })
);

builder.mutationField("updateLesson", (t) =>
  t.prismaField({
    type: "Lesson",
    args: {
      id: t.arg.id(),
      input: t.arg({ type: UpdateLessonInput }),
    },
    resolve: async (query, _parent, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      if (!args.id) {
        throw new Error("Lesson ID is required");
      }

      const lesson = await prisma.lesson.findUnique({
        where: { id: args.id },
      });

      if (!lesson) {
        throw new Error("Lesson not found");
      }

      const isAuthor = lesson.authorId === context.user.uid;
      const isAdmin = context.user.role === "admin";

      if (!isAuthor && !isAdmin) {
        throw new Error("Not authorized");
      }

      const input = args.input || {};
      const updatedLesson = await prisma.lesson.update({
        ...query,
        where: { id: args.id },
        data: {
          title: input.title ?? undefined,
          content: input.content ?? undefined,
        },
      });

      return updatedLesson;
    },
  })
);

builder.mutationField("deleteLesson", (t) =>
  t.prismaField({
    type: "Lesson",
    args: {
      id: t.arg.id(),
    },
    resolve: async (query, _parent, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      if (!args.id) {
        throw new Error("Lesson ID is required");
      }

      const lesson = await prisma.lesson.findUnique({
        where: { id: args.id },
      });

      if (!lesson) {
        throw new Error("Lesson not found");
      }

      const isAuthor = lesson.authorId === context.user.uid;
      const isAdmin = context.user.role === "admin";

      if (!isAuthor && !isAdmin) {
        throw new Error("Not authorized");
      }

      const deletedLesson = await prisma.lesson.delete({
        ...query,
        where: { id: args.id },
      });

      return deletedLesson;
    },
  })
);

builder.mutationField("publishLesson", (t) =>
  t.prismaField({
    type: "Lesson",
    args: {
      id: t.arg.id(),
    },
    resolve: async (query, _parent, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      if (!args.id) {
        throw new Error("Lesson ID is required");
      }

      const lesson = await prisma.lesson.findUnique({
        where: { id: args.id },
      });

      if (!lesson) {
        throw new Error("Lesson not found");
      }

      const isAuthor = lesson.authorId === context.user.uid;
      const isAdmin = context.user.role === "admin";

      if (!isAuthor && !isAdmin) {
        throw new Error("Not authorized");
      }

      const publishedLesson = await prisma.lesson.update({
        ...query,
        where: { id: args.id },
        data: {
          published: true,
        },
      });

      return publishedLesson;
    },
  })
);
