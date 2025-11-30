import { builder } from "@graphql/builder";

builder.prismaObject("LessonBlocks", {
  fields: (t) => ({
    id: t.exposeID("id"),
    type: t.exposeString("type"),
    url: t.exposeString("url", { nullable: true }),
    html: t.exposeString("html", { nullable: true }),
    caption: t.exposeString("caption", { nullable: true }),
    order: t.exposeInt("order"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    node: t.relation("node"),
  }),
});
