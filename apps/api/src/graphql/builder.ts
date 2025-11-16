// src/schema/builder.ts
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { Scalars } from "prisma-generator-pothos-codegen";
import { Prisma } from "@prisma/client";
import { prisma } from "@lib/prisma";

interface Context {
  user?: {
    id: string;
    email?: string;
    role: string;
  };
  prisma: typeof prisma; // Auto-CRUD support
}

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: Context;
  Scalars: Scalars<
    Prisma.Decimal,
    Prisma.InputJsonValue | null,
    Prisma.InputJsonValue
  >; // required to define correct types for created scalars.
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});
