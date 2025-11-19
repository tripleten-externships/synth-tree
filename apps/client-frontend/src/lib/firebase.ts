import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Firebase configuration - safe to expose in client-side code
// Firebase API keys are designed to be public and are used for identification, not authentication
// Security is handled by Firebase Security Rules and Authentication
// const firebaseConfig: FirebaseConfig = {
//   // Environment variables for build-time configuration (Vite will inline these during build)
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key-here",
//   authDomain:
//     import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
//   storageBucket:
//     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
//   messagingSenderId:
//     import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
//   appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, // Optional for Analytics
// };

const firebaseConfig: FirebaseConfig = {
  // Environment variables for build-time configuration (Vite will inline these during build)
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, // Optional for Analytics
};

// console.log("Firebase API key: ", import.meta.env.VITE_FIREBASE_API_KEY);
// console.log("Auth Domain: ", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
// console.log("Project ID: ", import.meta.env.VITE_FIREBASE_PROJECT_ID);
// console.log("Storage Bucket: ", import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
// console.log(
//   "Messaging Sender ID: ",
//   import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
// );
// console.log("App ID: ", import.meta.env.VITE_FIREBASE_APP_ID);
// console.log("Measurement ID: ", import.meta.env.VITE_FIREBASE_MEASUREMENT_ID);

// Validate that we have the required configuration
const validateConfig = (config: FirebaseConfig): void => {
  const requiredFields: (keyof FirebaseConfig)[] = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];

  const missingFields = requiredFields.filter(
    (field) =>
      !config[field] ||
      config[field] ===
        `your-${field.toLowerCase().replace(/([A-Z])/g, "-$1")}-here`
  );

  if (missingFields.length > 0) {
    console.warn(
      `Firebase configuration incomplete. Missing or placeholder values for: ${missingFields.join(
        ", "
      )}\n` +
        "Please update your environment variables or the firebaseConfig object with your actual Firebase project values."
    );
  }
};

// Validate configuration
validateConfig(firebaseConfig);

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Google Auth Provider
const provider = new GoogleAuthProvider();

// Connect to Auth emulator in development
if (
  import.meta.env.DEV &&
  import.meta.env.VITE_USE_FIREBASE_EMULATOR !== "false"
) {
  try {
    connectAuthEmulator(auth, "http://localhost:9099", {
      disableWarnings: true,
    });
    console.log("Connected to Firebase Auth emulator");
  } catch (error) {
    // Emulator connection failed, continue with production auth
    console.warn(
      "Firebase Auth emulator connection failed, using production auth:",
      error
    );
  }
}

// Pop up window to select Google account to sign in with
export const signInWithGoogle = () => signInWithPopup(auth, provider);

// Export the Firebase app instance as default
export default app;

// Export auth methods for convenience
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Export common Firebase types
export type { User as FirebaseUser } from "firebase/auth";
