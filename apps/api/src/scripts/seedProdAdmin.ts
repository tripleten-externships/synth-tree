/**
 * Seed a single ADMIN account in PRODUCTION so the owner can sign in with
 * Google (no password).
 *
 * Idempotent and prod-only: `start.sh` runs it only when NODE_ENV=production,
 * and this script refuses to run otherwise (mirror of the dev seeder's guard).
 *
 * How it works: create (or find) the Firebase Auth user for the admin email
 * with NO password and emailVerified=true, take its uid, and upsert a Prisma
 * `User` row keyed by that uid with role ADMIN. The API keys users by Firebase
 * uid, and `syncCurrentUser` (called by the app after login) updates name/email
 * but never role — so the ADMIN role set here persists across logins.
 *
 * ⚠️ Firebase account-linking: for a subsequent Google sign-in to resolve to the
 * SAME uid this seeds (and thus be recognized as this admin), the Firebase
 * project must use "Link accounts that use the same email" (one account per
 * email). If it's in multi-account mode, Google sign-in gets a different uid,
 * the API sees a non-admin, and syncCurrentUser fails on the unique-email
 * collision. This is a Firebase Console setting, not something this script can
 * set. See the PR description.
 */

import { Role } from "@prisma/client";

import { admin } from "../firebase";
import { prisma } from "../lib/prisma";

const ADMIN_EMAIL = process.env.PROD_ADMIN_EMAIL || "jahorwitz94@gmail.com";
const ADMIN_NAME = process.env.PROD_ADMIN_NAME || "Josh Horwitz";

/** Ensure a Firebase Auth user exists for `email` (no password); return its uid. */
async function ensureFirebaseUser(email: string, name: string): Promise<string> {
  const auth = admin!.auth();
  try {
    const existing = await auth.getUserByEmail(email);
    return existing.uid;
  } catch (err) {
    if ((err as { code?: string }).code !== "auth/user-not-found") throw err;
    try {
      // No password: the account can only be signed into via a federated
      // provider (Google), which is the intent.
      const created = await auth.createUser({
        email,
        displayName: name,
        emailVerified: true,
      });
      return created.uid;
    } catch (createErr) {
      // Another task may have created it between our lookup and create.
      if ((createErr as { code?: string }).code === "auth/email-already-exists") {
        return (await auth.getUserByEmail(email)).uid;
      }
      throw createErr;
    }
  }
}

async function main() {
  if (process.env.NODE_ENV !== "production") {
    console.error("❌ seedProdAdmin only runs with NODE_ENV=production.");
    process.exit(1);
  }

  if (!admin) {
    console.warn(
      "⚠️  Firebase admin not initialized (no credentials) — skipping prod admin seed.",
    );
    return;
  }

  console.log(`➡️  Ensuring prod admin ${ADMIN_EMAIL} (idempotent)…`);
  const uid = await ensureFirebaseUser(ADMIN_EMAIL, ADMIN_NAME);
  await prisma.user.upsert({
    where: { id: uid },
    update: { email: ADMIN_EMAIL, role: Role.ADMIN },
    create: { id: uid, email: ADMIN_EMAIL, name: ADMIN_NAME, role: Role.ADMIN },
  });
  console.log(`✅ Prod admin ready: ${ADMIN_EMAIL} (ADMIN). Sign in with Google.`);
}

main()
  .catch((err) => {
    console.error("❌ seedProdAdmin failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
