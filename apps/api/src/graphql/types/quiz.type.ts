import { builder } from "@graphql/builder";

// Quiz type
builder.prismaObject("Quiz", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    description: t.exposeString("description", { nullable: true }),
    published: t.exposeBoolean("published"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),

    // Nested questions relation
    questions: t.relation("questions"),
  }),
});

// Question type
builder.prismaObject("Question", {
  fields: (t) => ({
    id: t.exposeID("id"),
    prompt: t.exposeString("prompt"), // match Prisma
    type: t.exposeString("type"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    options: t.relation("options"),
  }),
});

// Option type
builder.prismaObject("Option", {
  fields: (t) => ({
    id: t.exposeID("id"),
    text: t.exposeString("text"),
    isCorrect: t.exposeBoolean("isCorrect"), // match Prisma
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});
