#!/usr/bin/env ts-node
/**
 * Refresh an expired Firebase ID token using the refresh_token saved by
 * createLocalUser. Updates the credentials JSON in place.
 *
 * Usage:
 *   pnpm refresh:token alice@example.com
 */

import "dotenv/config";
import * as fs from "fs";
import * as path from "path";

async function refreshToken(email: string) {
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error("FIREBASE_API_KEY is not set in environment (.env).");
  }

  const safeEmail = email.replace(/[^a-zA-Z0-9._-]/g, "_");
  const credsPath = path.join(
    process.cwd(),
    "scripts/credentials",
    `${safeEmail}.credentials.json`,
  );

  if (!fs.existsSync(credsPath)) {
    throw new Error(
      `No credentials file at ${credsPath}. Run 'pnpm create:user' first.`,
    );
  }

  const json = JSON.parse(fs.readFileSync(credsPath, "utf8"));

  const res = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: json.refreshToken,
      }),
    },
  );

  if (!res.ok) {
    throw new Error(
      `Failed to refresh token (${res.status}): ${await res.text()}`,
    );
  }

  const data = (await res.json()) as { id_token: string; refresh_token: string };
  json.idToken = data.id_token;
  json.refreshToken = data.refresh_token;
  json.refreshedAt = new Date().toISOString();

  fs.writeFileSync(credsPath, JSON.stringify(json, null, 2), "utf8");

  console.log("✅ Refreshed token for", email);
  console.log("");
  console.log("New idToken:");
  console.log(json.idToken);
}

const email = process.argv[2];
if (!email) {
  console.error("Usage: pnpm refresh:token <email>");
  process.exit(1);
}

refreshToken(email).catch((err) => {
  console.error("❌ refreshLocalToken failed:", err);
  process.exit(1);
});
