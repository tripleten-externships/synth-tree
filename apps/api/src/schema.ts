import { builder } from "./graphql/builder";
import "./graphql/skillNode/skillNodeType";
import "./graphql/skillNode/skillNode.queries";
import "./graphql/lessonBlocks/blockType";
import "./graphql/lessonBlocks/block.queries";
import "./graphql/lessonBlocks/block.mutations";
import { generateAllCrud } from "./graphql/__generated__/autocrud";

// Auto-generate CRUD
generateAllCrud();

builder.queryType({});
builder.mutationType({});

export const schema = builder.toSchema({});
