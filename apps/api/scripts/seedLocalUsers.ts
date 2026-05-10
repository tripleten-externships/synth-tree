#!/usr/bin/env ts-node
/**
 * Seed the standard set of local test users. Idempotent — re-running just
 * upserts and refreshes tokens. Intended for first-time local setup.
 *
 * Usage:
 *   pnpm db:seed:local-users
 */

import "dotenv/config";

import { prisma } from "../src/lib/prisma";

import { createLocalUser } from "./createLocalUser";

const DEFAULT_PASSWORD = "Local123!";

const seedUsers: Array<{
  email: string;
  name: string;
  role: "admin" | "user";
}> = [
  { email: "admin@local.dev", name: "Local Admin", role: "admin" },
  { email: "learner@local.dev", name: "Local Learner", role: "user" },
];

async function main() {
  console.log(`➡️  Seeding ${seedUsers.length} local user(s) with the default password "${DEFAULT_PASSWORD}"`);
  console.log("");

  for (const u of seedUsers) {
    console.log(`── ${u.email} (${u.role}) ──`);
    await createLocalUser({
      ...u,
      password: DEFAULT_PASSWORD,
      skipConfirm: true,
    });
    console.log("");
  }

  console.log("✅ Seed complete. You can log in to either app with:");
  for (const u of seedUsers) {
    console.log(`    ${u.email.padEnd(22)} / ${DEFAULT_PASSWORD}     (${u.role})`);
  }
}

main()
  .catch((err) => {
    console.error("❌ seedLocalUsers failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
