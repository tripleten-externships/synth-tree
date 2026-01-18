// scripts/refreshDevToken.ts
import "dotenv/config";
import * as fs from "fs";
import * as path from "path";

async function refreshToken(email: string) {
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!apiKey) throw new Error("Missing FIREBASE_API_KEY");

  const safeEmail = email.replace(/[^a-zA-Z0-9._-]/g, "_");
  const credsPath = path.join(
    process.cwd(),
    "scripts/credentials",
    `${safeEmail}.credentials.json`
  );
  const raw = fs.readFileSync(credsPath, "utf8");
  const json = JSON.parse(raw);

  const res = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: json.refreshToken,
      }),
    }
  );

  if (!res.ok) {
    console.error("Failed to refresh token:", res.status, await res.text());
    process.exit(1);
  }

  const data: any = await res.json();
  json.idToken = data.id_token;
  json.refreshToken = data.refresh_token;
  json.refreshedAt = new Date().toISOString();

  fs.writeFileSync(credsPath, JSON.stringify(json, null, 2), "utf8");

  console.log("✅ Refreshed dev token. New idToken:");
  console.log(json.idToken);
}

const email = process.argv[2];
if (!email) {
  console.error("Usage: ts-node scripts/refreshDevToken.ts <email>");
  process.exit(1);
}

refreshToken(email).catch((err) => {
  console.error(err);
  process.exit(1);
});
