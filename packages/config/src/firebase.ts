import { type FirebaseApp, type FirebaseOptions, getApps, initializeApp } from "firebase/app";
import { type Auth, connectAuthEmulator, getAuth } from "firebase/auth";

/**
 * Reads Firebase configuration from `import.meta.env.VITE_FIREBASE_*`.
 * The keys are inlined at build time by Vite, so each consuming app gets
 * its own values without having to pass them through.
 */
export function getFirebaseConfig(): FirebaseOptions {
  const config: FirebaseOptions = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  const required: Array<keyof FirebaseOptions> = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];
  const missing = required.filter((key) => !config[key]);
  if (missing.length > 0) {
    throw new Error(
      `Firebase config incomplete. Missing env vars: ${missing
        .map((k) => `VITE_FIREBASE_${k.replace(/([A-Z])/g, "_$1").toUpperCase()}`)
        .join(", ")}`,
    );
  }

  return config;
}

/**
 * Returns a singleton FirebaseApp + Auth pair for the current page.
 * Re-uses an existing app if one has already been initialized (HMR-safe).
 *
 * In dev, automatically connects to the Firebase Auth emulator unless
 * `VITE_USE_FIREBASE_EMULATOR=false` is set.
 */
export function initFirebaseAuth(): { app: FirebaseApp; auth: Auth } {
  const app = getApps()[0] ?? initializeApp(getFirebaseConfig());
  const auth = getAuth(app);

  if (
    import.meta.env.DEV &&
    import.meta.env.VITE_USE_FIREBASE_EMULATOR !== "false"
  ) {
    try {
      connectAuthEmulator(auth, "http://localhost:9099", {
        disableWarnings: true,
      });
    } catch {
      // Emulator not running — silently fall through to production auth.
    }
  }

  return { app, auth };
}
