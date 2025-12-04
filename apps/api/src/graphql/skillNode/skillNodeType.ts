import { builder } from "@graphql/builder";

builder.prismaObject("SkillNode", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    step: t.exposeInt("step"),
    orderInStep: t.exposeInt("orderInStep"),
    posX: t.exposeInt("posX", { nullable: true }),
    posY: t.exposeInt("posY", { nullable: true }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),

    tree: t.relation("tree"),
    lessons: t.relation("lessons"),
  }),
});
