import { initFirebaseAuth } from "@synth-tree/config/firebase";

const { app, auth } = initFirebaseAuth();

export { app, auth };
export default app;

// Re-export the auth helpers callers in this app commonly need.
export {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
export type { User as FirebaseUser } from "firebase/auth";
