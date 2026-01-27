#!/usr/bin/env ts-node

import "dotenv/config";
import { Role } from "@prisma/client";
import { prisma } from "../src/lib/prisma";
import { admin } from "../src/firebase";
import * as fs from "fs";
import * as path from "path";

function getArg(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index === process.argv.length - 1) return undefined;
  return process.argv[index + 1];
}

async function main() {
  const email = getArg("--email");
  const name = getArg("--name");
  const roleArg = (getArg("--role") || "ADMIN").toUpperCase();
  const password = getArg("--password");

  if (!email || !name) {
    console.error(
      'Usage: ts-node scripts/createDevAdminUser.ts --email <email> --name "<name>" [--role ADMIN|USER] [--password <password>]',
    );
    process.exit(1);
  }

  if (!Object.prototype.hasOwnProperty.call(Role, roleArg)) {
    console.error(
      `Invalid role "${roleArg}". Must be one of: ${Object.keys(Role).join(
        ", ",
      )}`,
    );
    process.exit(1);
  }

  const role = Role[roleArg as keyof typeof Role];

  if (!admin) {
    console.error(
      "Firebase admin is not initialized. Check FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL env vars.",
    );
    process.exit(1);
  }

  const apiKey = process.env.FIREBASE_API_KEY;
  if (!apiKey) {
    console.error("FIREBASE_API_KEY is not set in environment (.env).");
    process.exit(1);
  }

  try {
    console.log("➡️  Ensuring Firebase user exists…");

    // 1. Create or fetch Firebase Auth user
    let firebaseUser;
    let isNewUser = false;
    try {
      firebaseUser = await admin.auth().getUserByEmail(email);
      console.log(
        `ℹ️  Firebase user already exists with UID: ${firebaseUser.uid}`,
      );

      // Update password if provided for existing user
      if (password) {
        await admin.auth().updateUser(firebaseUser.uid, {
          password,
        });
        console.log(`✅ Updated password for existing Firebase user`);
      }
    } catch (err: any) {
      if (err?.code === "auth/user-not-found") {
        const createUserParams: any = {
          email,
          displayName: name,
        };

        // Set password if provided for new user
        if (password) {
          createUserParams.password = password;
        }

        firebaseUser = await admin.auth().createUser(createUserParams);
        isNewUser = true;
        console.log(`✅ Created Firebase user with UID: ${firebaseUser.uid}`);
        if (password) {
          console.log(`✅ Password set for new Firebase user`);
        }
      } else {
        console.error("❌ Error fetching/creating Firebase user:", err);
        process.exit(1);
      }
    }

    const uid = firebaseUser.uid;

    // 2. Upsert into Prisma User table
    console.log("➡️  Upserting user into Prisma…");

    const user = await prisma.user.upsert({
      where: { id: uid },
      update: { email, name, role },
      create: { id: uid, email, name, role },
    });

    console.log(
      `✅ Prisma user upserted. id=${user.id}, email=${user.email}, role=${user.role}`,
    );

    // 3. Create a custom token
    console.log("➡️  Creating Firebase custom token…");
    const customToken = await admin.auth().createCustomToken(uid);

    // 4. Exchange custom token for ID token via Firebase REST API
    console.log("➡️  Exchanging custom token for ID token via REST…");

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: customToken,
          returnSecureToken: true,
        }),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(
        "❌ Failed to exchange custom token for ID token:",
        response.status,
        text,
      );
      process.exit(1);
    }

    const data: any = await response.json();
    const idToken = data.idToken;
    const refreshToken = data.refreshToken;

    if (!idToken) {
      console.error("❌ No idToken returned from Firebase token exchange.");
      process.exit(1);
    }

    // 5. Save credentials to a .gitignored folder
    const outDir = path.resolve(process.cwd(), "scripts/credentials");
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const safeEmail = email.replace(/[^a-zA-Z0-9._-]/g, "_");
    const outPath = path.join(outDir, `${safeEmail}.credentials.json`);

    const payload = {
      email,
      uid,
      role,
      password,
      idToken,
      refreshToken,
      createdAt: new Date().toISOString(),
    };

    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8");

    console.log("✅ Dev credentials written to:");
    console.log(`   ${outPath}`);
    console.log("\nUse this token in Apollo Sandbox headers:\n");
    console.log("  {");
    console.log('    "authorization": "Bearer ' + idToken + '"');
    console.log("  }");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("❌ Script failed:", err);
  process.exit(1);
});
