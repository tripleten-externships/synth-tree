import { PrismaClient } from "@prisma/client";

declare global {
  // Prevent multiple Prisma instances in dev (Hot Reload fix)
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"], // optional
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
