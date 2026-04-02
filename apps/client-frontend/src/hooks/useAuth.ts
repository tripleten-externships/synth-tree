import { getAuth, signOut } from "firebase/auth";

export default function useAuth() {
  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
    window.location.href = "/"; // redirect after logout
  };

  return { logout };
}