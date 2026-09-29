import { type FirebaseApp, type FirebaseOptions, getApps, initializeApp } from "firebase/app";
import { type Auth, connectAuthEmulator, getAuth } from "firebase/auth";

/**
 * Reads Firebase configuration from `import.meta.env.VITE_FIREBASE_*`.
 * The keys are inlined at build time by Vite, so each consuming app gets
 * its own values without having to pass them through.
 *
 * Only `apiKey`, `authDomain`, and `projectId` are required — these drive
 * Firebase Auth, which is the only Firebase product these apps use. The
 * remaining fields (`storageBucket`, `messagingSenderId`, `appId`) are only
 * read by Cloud Storage / Cloud Messaging / Analytics respectively; none of
 * those SDKs are initialized here, so we fall back to inert placeholders and
 * skip requiring build-time env vars for them. If a Storage/Messaging/Analytics
 * SDK is ever added, set the real values (and move the field back to `required`).
 */
export function getFirebaseConfig(): FirebaseOptions {
  const config: FirebaseOptions = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    // Unused by Auth — inert defaults so a missing env var doesn't break the build.
    storageBucket:
      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "unused.appspot.com",
    messagingSenderId:
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
    appId:
      import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  // Auth-critical fields: fail loudly if these are missing rather than booting
  // with broken sign-in.
  const required: Array<keyof FirebaseOptions> = [
    "apiKey",
    "authDomain",
    "projectId",
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
 * Connects to the Firebase Auth emulator (localhost:9099) ONLY when
 * `VITE_USE_FIREBASE_EMULATOR=true` is set. The default is to use the real
 * Firebase project the env vars point at — typically the shared "local"
 * Firebase project.
 */
export function initFirebaseAuth(): { app: FirebaseApp; auth: Auth } {
  const app = getApps()[0] ?? initializeApp(getFirebaseConfig());
  const auth = getAuth(app);

  if (
    import.meta.env.DEV &&
    import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true"
  ) {
    try {
      connectAuthEmulator(auth, "http://localhost:9099", {
        disableWarnings: true,
      });
    } catch {
      // Emulator not running — silently fall through to the real project.
    }
  }

  return { app, auth };
}
