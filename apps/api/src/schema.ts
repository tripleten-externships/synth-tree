import { builder } from "@graphql/builder";
import "@graphql/models/models.all"; //load every model definition
import "@graphql/queries"; //load every query file
import "@graphql/mutations"; //load every mutation file

builder.queryType({}); //This sets up the GraphQL schema’s entry points.
builder.mutationType({}); //All actual fields are added by the auto‑loaded files above.

export const schema = builder.toSchema({}); //This compiles everything Pothos has loaded into a complete GraphQL schema object.
//This schema is then used by Apollo Server to serve your API.
