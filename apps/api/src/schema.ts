import { builder } from "./graphql/builder";
import "./graphql/models/models.all";
import "./graphql/mutations";
import "./graphql/queries";
import { generateAllCrud } from "./graphql/__generated__/autocrud";

// Auto-generate CRUD
generateAllCrud();

builder.queryType({});
builder.mutationType({});

export const schema = builder.toSchema({});
