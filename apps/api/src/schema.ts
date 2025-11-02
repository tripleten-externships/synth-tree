import { builder } from "./graphql/builder";
import { generateAllCrud } from "./graphql/__generated__/autocrud";

generateAllCrud();

builder.queryType({});
builder.mutationType({});

export const schema = builder.toSchema({});
