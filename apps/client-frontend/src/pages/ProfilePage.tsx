import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// IMPORTANT: your project uses the React-specific Apollo entrypoint
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Award,
  CalendarCheck,
  CalendarDays,
  Footprints,
  GitBranch,
  Globe,
  Layers,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { SYNC_CURRENT_USER } from "../graphql/queries/currentUser";
import type { SyncCurrentUserResponse } from "../graphql/queries/currentUser";
import { MY_PROGRESS_QUERY } from "../graphql/queries/myProgress";
import { MY_ACHIEVEMENTS_QUERY } from "../graphql/queries/myAchievements";
import type { MyAchievementsResponse } from "../graphql/queries/myAchievements";
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
  quizAttempts: {
    id: string;
    quizId: string;
  }[];
}

interface MyProgressData {
  myProgress: {
    id: string;
    status: string;
    node: {
      tree: {
        course: {
          id: string;
        };
      };
    };
  }[];
}

const achievementIcons: Record<string, LucideIcon> = {
  footsteps: Footprints,
  layers: Layers,
  calendar: CalendarDays,
  "calendar-check": CalendarCheck,
  star: Star,
  "git-branch": GitBranch,
  trophy: Trophy,
  globe: Globe,
};

const achievementColors: Record<string, string> = {
  primary: "border-primary/30 bg-primary/5 text-primary",
  success: "border-emerald-300 bg-emerald-50 text-emerald-800",
  warning: "border-amber-300 bg-amber-50 text-amber-800",
  destructive: "border-destructive/30 bg-destructive/5 text-destructive",
  brand: "border-sky-300 bg-sky-50 text-sky-800",
};

export default function ProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "achievements">("profile");

  // ------------------------------------------------------------
  // 1) Apollo mutation used for BOTH loading and saving the user
  //    Your backend does not have GET_CURRENT_USER, so this is
  //    the only operation that returns the current user.
  // ------------------------------------------------------------
  const [syncUser, { data, loading, error }] =
    useMutation<SyncCurrentUserResponse>(SYNC_CURRENT_USER);

  // ------------------------------------------------------------
  // 2) Load real learner progress for profile stats
  // ------------------------------------------------------------
  const {
    data: progressData,
    loading: progressLoading,
    error: progressError,
  } = useQuery<MyProgressData>(MY_PROGRESS_QUERY, {
    fetchPolicy: "network-only",
  });

  // ------------------------------------------------------------
  // 3) Load the user on first render
  //    Wait for Firebase auth state before firing mutation
  //    so the Bearer token is ready and attached by apollo.ts
  // ------------------------------------------------------------
  const [firebaseLoading, setFirebaseLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {
    data: achievementsData,
    loading: achievementsLoading,
    error: achievementsError,
  } = useQuery<MyAchievementsResponse>(MY_ACHIEVEMENTS_QUERY, {
    skip: firebaseLoading || !isAuthenticated,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setIsAuthenticated(Boolean(firebaseUser));
      if (firebaseUser) {
        syncUser();
      }
      // Firebase has finished checking — user logged in or not
      setFirebaseLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ------------------------------------------------------------
  // 4) Use the real synced user
  // ------------------------------------------------------------
  const user: User | undefined = data?.syncCurrentUser;

  // ------------------------------------------------------------
  // 5) Editable fields (name + photo)
  // ------------------------------------------------------------
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

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
      // No Firebase session — send them to login via the router (origin-agnostic,
      // so it works in any deployed environment, not just local dev).
      navigate("/auth/login", { replace: true });
      return;
    }

    syncUser({ variables: { name, photoUrl } });
  };

  // ------------------------------------------------------------
  // 8) Loading + Error states
  // ------------------------------------------------------------
  if (firebaseLoading || (loading && !data) || (progressLoading && !progressData)) {
    return (
      <div className="min-h-screen p-8">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (error || progressError || !user) {
    return (
      <div className="min-h-screen p-8">
        <p className="text-destructive">Error loading profile.</p>
      </div>
    );
  }

  // ------------------------------------------------------------
  // 9) Calculate real profile stats
  // ------------------------------------------------------------
  const progress = progressData?.myProgress ?? [];

  const coursesStarted = new Set(progress.map((item) => item.node.tree.course.id)).size;

  const nodesCompleted = progress.filter((item) => item.status === "COMPLETED").length;

  // quizAttempts is already filtered to passed attempts, one per quiz;
  // count distinct quizIds so retakes never double-count.
  const quizzesPassed = new Set(user.quizAttempts.map((attempt) => attempt.quizId)).size;

  // ------------------------------------------------------------
  // 10) Main UI
  // ------------------------------------------------------------
  return (
    <div className="min-h-screen">
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <div role="tablist" aria-label="Profile sections" className="flex gap-2 border-b mt-6">
          <button
            id="profile-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "profile"}
            aria-controls="profile-panel"
            onClick={() => setActiveTab("profile")}
            className={`border-b-2 px-4 py-2 ${activeTab === "profile" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
          >
            Profile
          </button>
          <button
            id="achievements-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "achievements"}
            aria-controls="achievements-panel"
            onClick={() => setActiveTab("achievements")}
            className={`border-b-2 px-4 py-2 ${activeTab === "achievements" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
          >
            Achievements
          </button>
        </div>

        {activeTab === "profile" ? (
          <section id="profile-panel" role="tabpanel" aria-labelledby="profile-tab">
            <p className="mt-4">Manage your profile and account settings</p>

            {/* User Info */}
            <section className="flex items-center gap-6 mt-6">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
                  {user.name?.charAt(0)?.toUpperCase() ??
                    user.email?.charAt(0)?.toUpperCase() ??
                    "?"}
                </div>
              )}

              <div>
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">Role: {user.role}</p>
              </div>
            </section>

            {/* Edit Form */}
            <section className="bg-card p-6 rounded-lg shadow space-y-4 mt-6">
              <h3 className="text-xl font-semibold">Edit Profile</h3>

              <label className="block">
                <span className="text-foreground">Name</span>
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
                <span className="text-foreground">Photo URL</span>
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
                className="bg-primary text-primary-foreground px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-card p-4 rounded shadow text-center">
                <p className="text-2xl font-bold">{coursesStarted}</p>
                <p className="text-muted-foreground">Courses</p>
              </div>

              <div className="bg-card p-4 rounded shadow text-center">
                <p className="text-2xl font-bold">{nodesCompleted}</p>
                <p className="text-muted-foreground">Nodes</p>
              </div>

              <div className="bg-card p-4 rounded shadow text-center">
                <p className="text-2xl font-bold">{quizzesPassed}</p>
                <p className="text-muted-foreground">Quizzes</p>
              </div>
            </section>
          </section>
        ) : (
          <section
            id="achievements-panel"
            role="tabpanel"
            aria-labelledby="achievements-tab"
            className="mt-6"
          >
            {achievementsLoading && (
              <p className="text-muted-foreground">Loading achievements...</p>
            )}
            {achievementsError && <p className="text-destructive">Could not load achievements.</p>}
            {!isAuthenticated && (
              <p className="text-muted-foreground">Sign in to view achievements.</p>
            )}
            {!achievementsLoading &&
              !achievementsError &&
              isAuthenticated &&
              (achievementsData?.myAchievements.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {achievementsData.myAchievements.map(({ earnedAt, achievement }) => {
                    const Icon = achievementIcons[achievement.icon] ?? Award;
                    const colorClass =
                      achievementColors[achievement.color] ?? achievementColors.primary;

                    return (
                      <article key={achievement.id} className="rounded-md border bg-card p-4">
                        <div className="flex items-start gap-3">
                          <span
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md border ${colorClass}`}
                          >
                            <Icon size={22} aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <h2 className="font-semibold">{achievement.name}</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                        <p className="mt-4 text-xs text-muted-foreground">
                          Earned{" "}
                          {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                            new Date(earnedAt),
                          )}
                        </p>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No achievements earned yet.</p>
              ))}
          </section>
        )}

        <button onClick={logout} className="text-destructive underline mt-6">
          Logout
        </button>
      </main>
    </div>
  );
}
