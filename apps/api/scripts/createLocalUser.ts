#!/usr/bin/env ts-node
/**
 * Create (or upsert) a user in your *local* Firebase project + the local
 * Postgres database, then mint a Firebase ID token for hitting the API as
 * that user.
 *
 * Designed to be run by every student against the shared "local" Firebase
 * project — never against dev or prod. Refuses to run with NODE_ENV=production
 * and prints the active Firebase project for visibility.
 *
 * Exports `createLocalUser()` for re-use by scripts/seedLocalUsers.ts.
 *
 * CLI:
 *   pnpm create:user --email alice@example.com --name "Alice"
 *   pnpm create:user --email alice-admin@example.com --name "Alice (admin)" --role admin --password Local123!
 */

import "dotenv/config";
import * as fs from "fs";
import * as path from "path";

import { Role } from "@prisma/client";
import type { CreateRequest } from "firebase-admin/auth";

import { admin } from "../src/firebase";
import { prisma } from "../src/lib/prisma";

export interface CreateLocalUserOptions {
  email: string;
  name: string;
  /** Defaults to USER. Case-insensitive: accepts "admin"/"user"/"ADMIN"/"USER". */
  role?: string;
  /** Optional password. Set or update if provided. */
  password?: string;
  /** Skip the 3-second cancellable confirmation prompt (used by seed script). */
  skipConfirm?: boolean;
}

export interface CreateLocalUserResult {
  uid: string;
  email: string;
  role: Role;
  /** Set when FIREBASE_API_KEY is configured; otherwise undefined. */
  idToken?: string;
  /** Set when FIREBASE_API_KEY is configured; otherwise undefined. */
  refreshToken?: string;
  credentialsPath: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Hard guard: refuse to run against production no matter what. */
function assertNotProduction() {
  if (process.env.NODE_ENV === "production") {
    console.error(
      "❌ createLocalUser refuses to run with NODE_ENV=production. " +
        "This script is for local development only.",
    );
    process.exit(1);
  }
}

/** Visibility guard: print the active Firebase project and let the operator bail. */
async function confirmProject(skipConfirm: boolean) {
  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    (process.env.FIREBASE_SERVICE_ACCOUNT_PATH
      ? readProjectIdFromServiceAccount(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
      : "(unknown — Firebase credentials not configured)");

  console.warn("");
  console.warn(`⚠️  About to create a user in Firebase project: ${projectId}`);
  console.warn("   This script is intended for the *local* Firebase project only.");
  if (!skipConfirm) {
    console.warn("   Press Ctrl+C in 3s to abort…");
    console.warn("");
    await sleep(3000);
  }
}

function readProjectIdFromServiceAccount(p: string): string {
  try {
    const resolved = path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
    const json = JSON.parse(fs.readFileSync(resolved, "utf8"));
    return json.project_id ?? "(missing project_id)";
  } catch {
    return "(could not read service-account JSON)";
  }
}

function normalizeRole(input?: string): Role {
  if (!input) return Role.USER;
  const upper = input.toUpperCase();
  if (!Object.prototype.hasOwnProperty.call(Role, upper)) {
    throw new Error(
      `Invalid role "${input}". Must be one of: ${Object.keys(Role).join(", ")}`,
    );
  }
  return Role[upper as keyof typeof Role];
}

export async function createLocalUser(
  opts: CreateLocalUserOptions,
): Promise<CreateLocalUserResult> {
  assertNotProduction();
  await confirmProject(opts.skipConfirm ?? false);

  if (!admin) {
    throw new Error(
      "Firebase admin is not initialized. Set FIREBASE_SERVICE_ACCOUNT_PATH " +
        "(recommended) or FIREBASE_PROJECT_ID + FIREBASE_PRIVATE_KEY + FIREBASE_CLIENT_EMAIL.",
    );
  }

  // Optional — only needed to mint an ID token for headless API testing.
  // Without it, the user still gets created in Firebase + Postgres and can
  // log in through the frontend UI normally.
  const apiKey = process.env.FIREBASE_API_KEY;

  const role = normalizeRole(opts.role);

  // 1. Ensure Firebase Auth user exists.
  console.log("➡️  Ensuring Firebase user exists…");
  let firebaseUser;
  try {
    firebaseUser = await admin.auth().getUserByEmail(opts.email);
    console.log(`ℹ️  Firebase user already exists with UID: ${firebaseUser.uid}`);
    if (opts.password) {
      await admin.auth().updateUser(firebaseUser.uid, {
        password: opts.password,
        emailVerified: true,
      });
      console.log("✅ Updated password for existing Firebase user");
    }
  } catch (err) {
    if ((err as { code?: string }).code === "auth/user-not-found") {
      const createParams: CreateRequest = {
        email: opts.email,
        displayName: opts.name,
        emailVerified: true,
      };
      if (opts.password) createParams.password = opts.password;
      firebaseUser = await admin.auth().createUser(createParams);
      console.log(`✅ Created Firebase user with UID: ${firebaseUser.uid}`);
    } else {
      throw err;
    }
  }

  const uid = firebaseUser.uid;

  // 2. Upsert into Prisma.
  console.log("➡️  Upserting user into Prisma…");
  const user = await prisma.user.upsert({
    where: { id: uid },
    update: { email: opts.email, name: opts.name, role },
    create: { id: uid, email: opts.email, name: opts.name, role },
  });
  console.log(`✅ Prisma user upserted: id=${user.id} role=${user.role}`);

  // 3. (Optional) Mint a real Firebase ID token via the custom-token → ID-token
  //    exchange. Requires FIREBASE_API_KEY (the public Web API key). If it's
  //    not configured, we skip this step — the user can still log in through
  //    the frontend UI without it. To enable headless API auth (Apollo Sandbox,
  //    curl, etc.), add FIREBASE_API_KEY to apps/api/.env and re-run this
  //    script.
  let idToken: string | undefined;
  let refreshToken: string | undefined;

  if (apiKey) {
    console.log("➡️  Minting Firebase ID token…");
    const customToken = await admin.auth().createCustomToken(uid);
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: customToken, returnSecureToken: true }),
      },
    );
    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Failed to exchange custom token for ID token (${response.status}): ${text}`,
      );
    }
    const data = (await response.json()) as {
      idToken?: string;
      refreshToken?: string;
    };
    if (!data.idToken || !data.refreshToken) {
      throw new Error("Token exchange returned no idToken/refreshToken");
    }
    idToken = data.idToken;
    refreshToken = data.refreshToken;
  } else {
    console.log(
      "ℹ️  Skipping ID-token mint (FIREBASE_API_KEY not set). User can still " +
        "log in via the frontend UI; add the key to apps/api/.env to enable " +
        "headless API auth.",
    );
  }

  // 4. Persist credentials to the gitignored credentials/ folder.
  const outDir = path.resolve(process.cwd(), "scripts/credentials");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const safeEmail = opts.email.replace(/[^a-zA-Z0-9._-]/g, "_");
  const credentialsPath = path.join(outDir, `${safeEmail}.credentials.json`);
  const payload = {
    email: opts.email,
    uid,
    role,
    password: opts.password,
    idToken,
    refreshToken,
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(credentialsPath, JSON.stringify(payload, null, 2), "utf8");

  console.log(`✅ Wrote credentials to ${credentialsPath}`);

  return {
    uid,
    email: opts.email,
    role,
    idToken,
    refreshToken,
    credentialsPath,
  };
}

// ─── CLI entrypoint ───────────────────────────────────────────────────────

function getArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx === process.argv.length - 1) return undefined;
  return process.argv[idx + 1];
}

async function main() {
  const email = getArg("--email");
  const name = getArg("--name");
  const role = getArg("--role");
  const password = getArg("--password");

  if (!email || !name) {
    console.error(
      'Usage: pnpm create:user --email <email> --name "<name>" [--role admin|user] [--password <pw>]',
    );
    process.exit(1);
  }

  try {
    const result = await createLocalUser({ email, name, role, password });
    console.log("");
    if (result.idToken) {
      console.log("Use this token in Apollo Sandbox (or curl) headers:");
      console.log("  {");
      console.log(`    "authorization": "Bearer ${result.idToken}"`);
      console.log("  }");
    } else {
      console.log(
        "User created. Log in via the frontend UI, or set FIREBASE_API_KEY in " +
          "apps/api/.env and re-run this script to mint a headless ID token.",
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Only run the CLI when this file is the entrypoint (so seedLocalUsers can
// `import { createLocalUser } from "./createLocalUser"` without triggering it).
if (require.main === module) {
  main().catch((err) => {
    console.error("❌ createLocalUser failed:", err);
    process.exit(1);
  });
}
