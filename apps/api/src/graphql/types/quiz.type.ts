import { builder } from "@graphql/builder";

// Define the Quiz type with nested questions relation
builder.prismaObject("Quiz", {
  fields: (t) => ({
    // Each quiz has a list of questions
    questions: t.relation("questions"),
  }),
});

// Define the Question type with nested options relation
builder.prismaObject("Question", {
  fields: (t) => ({
    // Each question has a list of options
    options: t.relation("options"),
  }),
});
