import { builder } from "@graphql/builder";
import "@graphql/models/models.all";
// AutoCrud Deleted. Used the fundamental GraphQL Models created by Pothos
import "@graphql/queries";
import "@graphql/mutations";

builder.queryType({});
builder.mutationType({});

export const schema = builder.toSchema({});
