import { useState, useEffect } from "react";
// IMPORTANT: your project uses the React-specific Apollo entrypoint
import { useMutation } from "@apollo/client/react";
import { SYNC_CURRENT_USER } from "../graphql/queries/currentUser";
import type { SyncCurrentUserResponse } from "../graphql/queries/currentUser";
import useAuth from "../hooks/useAuth";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";


// Shape of the user returned by syncCurrentUser
interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  role: string;
  stats?: {
    courses: number;
    nodes: number;
    quizzes: number;
  };
}

export default function ProfilePage() {
  const { logout } = useAuth();
  // ------------------------------------------------------------
  // 1) Apollo mutation used for BOTH loading and saving the user
  //    Your backend does not have GET_CURRENT_USER, so this is
  //    the only operation that returns the current user.
  // ------------------------------------------------------------
  const [syncUser, { data, loading, error }] =
  useMutation<SyncCurrentUserResponse>(SYNC_CURRENT_USER);

  // ------------------------------------------------------------
  // 2) Mock fallback data (used until backend returns real data)
  // ------------------------------------------------------------
  const mockUser: User = {
    id: "mock",
    name: "Jane Doe",
    email: "jane@example.com",
    photoUrl: "", // empty string so avatar initial fallback shows
    role: "Student",
    stats: {
      courses: 3,
      nodes: 42,
      quizzes: 12,
    },
  };

  // ------------------------------------------------------------
  // 3) Load the user on first render
  //    Wait for Firebase auth state before firing mutation
  //    so the Bearer token is ready and attached by apollo.ts
  // ------------------------------------------------------------
  const [firebaseLoading, setFirebaseLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        syncUser();
      }
      // Firebase has finished checking — user logged in or not
      setFirebaseLoading(false);
    });
    return () => unsubscribe();
  }, []);
  // ------------------------------------------------------------
  // 4) Real user or fallback
  // ------------------------------------------------------------
  const user: User = data?.syncCurrentUser || mockUser;

  // ------------------------------------------------------------
  // 5) Editable fields (name + photo)
  // ------------------------------------------------------------
  const [name, setName] = useState(user.name ?? "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl ?? "");

  // ------------------------------------------------------------
  // 6) When real data arrives, update the form fields
  // ------------------------------------------------------------
  useEffect(() => {
    if (data?.syncCurrentUser) {
      setName(data.syncCurrentUser.name ?? "");
      setPhotoUrl(data.syncCurrentUser.photoUrl ?? "");
    }
  }, [data]);

 // ------------------------------------------------------------
  // 7) Save handler — updates the user profile
  // ------------------------------------------------------------
  const handleSave = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      // No Firebase session — redirect to login
      window.location.href = "http://localhost:5173/auth/login";
      return;
    }
    syncUser({ variables: { name, photoUrl } });
  };

  // ------------------------------------------------------------
  // 8) Loading + Error states
  // ------------------------------------------------------------
  if (firebaseLoading || (loading && !data)) {
    return (
      <div className="min-h-screen p-8">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <p className="text-red-600">Error loading profile.</p>
      </div>
    );
  }

  // ------------------------------------------------------------
  // 9) Main UI
  // ------------------------------------------------------------
  return (
    <div className="min-h-screen">
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <p>Manage your profile and account settings</p>

        {/* User Info */}
        <section className="flex items-center gap-6 mt-6">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-600">
              {user.name?.charAt(0)?.toUpperCase() ?? user.email?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">Role: {user.role}</p>
          </div>
        </section>

        {/* Edit Form */}
        <section className="bg-white p-6 rounded-lg shadow space-y-4 mt-6">
          <h3 className="text-xl font-semibold">Edit Profile</h3>

           <label className="block">
            <span className="text-gray-700">Name</span>
            {/* defaultValue + key so input resets when real data loads.
                onFocus selects all text for easy replacement.
                onBlur updates state only when user leaves the field. */}
            <input
              type="text"
              defaultValue={name}
              key={name}
              onFocus={(e) => e.target.select()}
              onBlur={(e) => setName(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Photo URL</span>
            {/* Same pattern as name — onBlur prevents avatar flickering
                while typing/deleting a long URL. onFocus selects all
                so user can replace the whole URL in one click + type. */}
            <input
              type="text"
              defaultValue={photoUrl}
              key={photoUrl}
              onFocus={(e) => e.target.select()}
              onBlur={(e) => setPhotoUrl(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            />
          </label>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-2xl font-bold">{user.stats?.courses ?? 0}</p>
            <p className="text-gray-600">Courses</p>
          </div>

          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-2xl font-bold">{user.stats?.nodes ?? 0}</p>
            <p className="text-gray-600">Nodes</p>
          </div>

          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-2xl font-bold">{user.stats?.quizzes ?? 0}</p>
            <p className="text-gray-600">Quizzes</p>
          </div>
        </section>

        <button onClick={logout} className="text-red-600 underline mt-6">Logout</button>
      </main>
    </div>
  );
}
