import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

import logger from "./lib/logger";

let firebaseAdmin: typeof admin | null = null;

/**
 * Resolve a Firebase service-account credential from one of two sources:
 *   1. FIREBASE_SERVICE_ACCOUNT_PATH — path to a service-account JSON file.
 *      This is the recommended local-dev workflow: drop the JSON into
 *      apps/api/scripts/credentials/ (gitignored) and point the env var at it.
 *   2. FIREBASE_PROJECT_ID + FIREBASE_PRIVATE_KEY + FIREBASE_CLIENT_EMAIL —
 *      individual env vars. Used by deployed environments (CI/CD writes them
 *      from secret stores).
 */
function resolveCredential():
  | { projectId: string; privateKey: string; clientEmail: string }
  | null {
  const accountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (accountPath) {
    const resolved = path.isAbsolute(accountPath)
      ? accountPath
      : path.resolve(process.cwd(), accountPath);
    if (!fs.existsSync(resolved)) {
      logger.error(
        { path: resolved },
        "FIREBASE_SERVICE_ACCOUNT_PATH is set but the file does not exist",
      );
      return null;
    }
    const json = JSON.parse(fs.readFileSync(resolved, "utf8"));
    if (!json.project_id || !json.private_key || !json.client_email) {
      logger.error(
        { path: resolved },
        "Service-account JSON is missing project_id / private_key / client_email",
      );
      return null;
    }
    return {
      projectId: json.project_id,
      privateKey: json.private_key,
      clientEmail: json.client_email,
    };
  }

  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_CLIENT_EMAIL
  ) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };
  }

  return null;
}

const credential = resolveCredential();

if (credential) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(credential),
      });
    }
    firebaseAdmin = admin;
    logger.info(
      { projectId: credential.projectId },
      "Firebase admin initialized",
    );
  } catch (error) {
    logger.error({ err: error }, "Failed to initialize Firebase admin");
    firebaseAdmin = null;
  }
} else {
  logger.warn(
    "Firebase credentials not configured — authentication is disabled. " +
      "Set FIREBASE_SERVICE_ACCOUNT_PATH (recommended for local dev) or the " +
      "FIREBASE_PROJECT_ID + FIREBASE_PRIVATE_KEY + FIREBASE_CLIENT_EMAIL trio.",
  );
}

export { firebaseAdmin as admin };
