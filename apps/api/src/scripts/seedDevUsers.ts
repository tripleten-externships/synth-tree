/**
 * Seed the baseline admin + learner accounts for a DEPLOYED dev environment.
 *
 * Mirrors the local `pnpm db:seed:local-users` accounts (admin@local.dev /
 * learner@local.dev) so students can sign in to the dev apps with known
 * credentials. Idempotent — safe to run on every container start.
 *
 * This lives under `src/` (not `scripts/`) so the normal `tsc` build compiles
 * it into `dist/scripts/seedDevUsers.js`, which the production image ships and
 * `start.sh` runs in dev only. It is NEVER run in prod: `start.sh` gates on
 * NODE_ENV, and this script refuses to run with NODE_ENV=production as well.
 *
 * Creates users in whatever Firebase project the API's
 * FIREBASE_PROJECT_ID/PRIVATE_KEY/CLIENT_EMAIL point at (the dev project), plus
 * the matching Postgres `User` rows.
 */

import { Role } from "@prisma/client";

import { admin } from "../firebase";
import { prisma } from "../lib/prisma";

// Overridable via the dev task env; falls back to the shared local password.
const PASSWORD = process.env.SEED_DEV_PASSWORD || "Local123!";

const SEED_USERS: Array<{ email: string; name: string; role: Role }> = [
  { email: "admin@local.dev", name: "Dev Admin", role: Role.ADMIN },
  { email: "learner@local.dev", name: "Dev Learner", role: Role.USER },
];

/** Ensure a Firebase Auth user exists for `email`; return its uid. Race-safe. */
async function ensureFirebaseUser(
  email: string,
  name: string,
): Promise<string> {
  const auth = admin!.auth();
  try {
    const existing = await auth.getUserByEmail(email);
    await auth.updateUser(existing.uid, {
      password: PASSWORD,
      emailVerified: true,
    });
    return existing.uid;
  } catch (err) {
    if ((err as { code?: string }).code !== "auth/user-not-found") throw err;
    try {
      const created = await auth.createUser({
        email,
        displayName: name,
        password: PASSWORD,
        emailVerified: true,
      });
      return created.uid;
    } catch (createErr) {
      // Another task may have created it between our lookup and create.
      if ((createErr as { code?: string }).code === "auth/email-already-exists") {
        const now = await auth.getUserByEmail(email);
        return now.uid;
      }
      throw createErr;
    }
  }
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    console.error("❌ seedDevUsers refuses to run with NODE_ENV=production.");
    process.exit(1);
  }

  if (!admin) {
    console.warn(
      "⚠️  Firebase admin not initialized (no credentials) — skipping dev user seed.",
    );
    return;
  }

  console.log(`➡️  Seeding ${SEED_USERS.length} dev user(s) (idempotent)…`);
  for (const u of SEED_USERS) {
    const uid = await ensureFirebaseUser(u.email, u.name);
    await prisma.user.upsert({
      where: { id: uid },
      update: { email: u.email, name: u.name, role: u.role },
      create: { id: uid, email: u.email, name: u.name, role: u.role },
    });
    console.log(`   ✅ ${u.email} (${u.role})`);
  }
  console.log("✅ Dev user seed complete.");
}

main()
  .catch((err) => {
    console.error("❌ seedDevUsers failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
