import { builder } from "../builder";



builder.prismaObject("Quiz", {
  fields: (t) => ({
    id: t.exposeID("id"),
    nodeId: t.exposeString("nodeId"),
    title: t.exposeString("title", { nullable: true }),
    required: t.exposeBoolean("required"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    deletedAt: t.expose("deletedAt", { type: "DateTime", nullable: true }),

    questions: t.relation("questions"),
    attempts: t.relation("attempts"),
    node: t.relation("node"),
  }),
});



builder.prismaObject("QuizQuestion", {
  fields: (t) => ({
    id: t.exposeID("id"),
    quizId: t.exposeString("quizId"),
    prompt: t.exposeString("prompt"),
    type: t.expose("type", { type: "QuestionType" }),
    order: t.exposeInt("order"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),

    quiz: t.relation("quiz"),
    options: t.relation("options"),
    answers: t.relation("answers"),
  }),
});


builder.prismaObject("QuizOption", {
  fields: (t) => ({
    id: t.exposeID("id"),
    questionId: t.exposeString("questionId"),
    text: t.exposeString("text"),
    isCorrect: t.exposeBoolean("isCorrect"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),

    question: t.relation("question"),
  }),
});



builder.prismaObject("QuizAttempt", {
  fields: (t) => ({
    id: t.exposeID("id"),
    quizId: t.exposeString("quizId"),
    userId: t.exposeString("userId"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),

    quiz: t.relation("quiz"),
    answers: t.relation("answers"),
  }),
});



builder.prismaObject("QuizAnswer", {
  fields: (t) => ({
    id: t.exposeID("id"),
    attemptId: t.exposeString("attemptId"),
    questionId: t.exposeString("questionId"),
    optionId: t.exposeString("optionId", { nullable: true }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),

    attempt: t.relation("attempt"),
    question: t.relation("question"),
    option: t.relation("option"),
  }),
});
