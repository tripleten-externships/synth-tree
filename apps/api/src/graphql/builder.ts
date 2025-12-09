// src/schema/builder.ts
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { Scalars } from "prisma-generator-pothos-codegen";
import { Prisma } from "@prisma/client";
import { prisma } from "@lib/prisma";
import type { GraphQLContext } from "@graphql/context";

export const builder = new SchemaBuilder<{
  Context: GraphQLContext;
  // Type The context so it is recognized in the resolvers
  PrismaTypes: PrismaTypes;
  Context: GraphQLContext;
  Scalars: Scalars<
    Prisma.Decimal,
    Prisma.InputJsonValue | null,
    Prisma.InputJsonValue
  >;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});
