import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCsaWxOsW6tcrUMl8yolmEC113X5MGGkzA",
  authDomain: "skilltreedev-7395e.firebaseapp.com",
  projectId: "skilltreedev-7395e",
  storageBucket: "skilltreedev-7395e.firebasestorage.app",
  messagingSenderId: "340143033375",
  appId: "1:340143033375:web:d7682d6a84c8eb92c3192a",
  measurementId: "G-4Y3502Z2QT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Exports
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from "firebase/auth";

export default app;