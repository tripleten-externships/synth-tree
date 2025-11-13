import { builder } from "./graphql/builder";
import { generateAllCrud } from "./graphql/__generated__/autocrud";
import "./graphql/skill"; // custom SkillTree/SkillNode queries & mutations

// Register generated CRUD objects/operations (uses the generator output in /generated)
generateAllCrud();

builder.queryType({});
builder.mutationType({});

export const schema = builder.toSchema({});
