import { builder } from "./graphql/builder";
import { generateAllCrud } from "./graphql/__generated__/autocrud";

// Custom resolvers
import "./graphql/user";
import "./graphql/ui-customization";

// Auto-generate CRUD
generateAllCrud();

builder.queryType({});
builder.mutationType({});

export const schema = builder.toSchema({});
