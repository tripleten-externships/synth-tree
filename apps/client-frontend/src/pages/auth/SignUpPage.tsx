import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useSearchParams, useNavigate, Link, Navigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useMutation } from "@apollo/client/react";
import { useSavedInterestsQuery } from "@synth-tree/api-types";
import { auth } from "../../lib/firebase";
import { useAuthContext } from "../../contexts/AuthContext";
import { SYNC_CURRENT_USER } from "../../graphql/queries/currentUser";
import { UPDATE_ONBOARDING, COMPLETE_ONBOARDING } from "../../graphql/mutations/updateOnboarding";
import { DEFAULT_DAILY_GOAL_MINUTES } from "../../lib/xpWeek";

// ─── Types ────────────────────────────────────────────────────────────────────

const STEPS = [1, 2, 3] as const;
type Step = (typeof STEPS)[number];

interface Step1Fields {
  name: string;
  email: string;
  password: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const validateStep1 = (f: Step1Fields): boolean =>
  f.name.trim().length >= 1 && isValidEmail(f.email) && f.password.length >= 10;

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: Step }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={1}
      aria-valuemax={STEPS.length}
      aria-label={`Step ${step} of ${STEPS.length}`}
      className="flex gap-1.5 w-full mb-9"
    >
      {STEPS.map((n) => {
        const isDone = n < step;
        const isActive = n === step;
        return (
          <div key={n} className="flex-1 h-1 rounded-full bg-zinc-200 overflow-hidden">
            <div
              className={[
                "h-full rounded-full transition-all duration-400",
                isDone
                  ? "w-full bg-[hsl(var(--primary)/0.5)]"
                  : isActive
                    ? "w-full bg-primary"
                    : "w-0",
              ].join(" ")}
            />
          </div>
        );
      })}
    </div>
  );
}

// ─── Password strength ────────────────────────────────────────────────────────

const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"] as const;

const STRENGTH_HEX = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"] as const;

function PasswordStrengthBar({ id, password }: { id: string; password: string }) {
  const score = (() => {
    let s = 0;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s as 0 | 1 | 2 | 3 | 4;
  })();

  const color = STRENGTH_HEX[score];

  return (
    <div id={id} className="flex items-center gap-2 mt-2" aria-live="polite">
      <div className="flex gap-1 flex-1" aria-hidden="true">
        {([1, 2, 3, 4] as const).map((n) => (
          <div
            key={n}
            className="flex-1 h-0.5 rounded-full transition-colors duration-300"
            style={{ background: n <= score ? color : "hsl(var(--muted))" }}
          />
        ))}
      </div>
      <span className="text-[11px] font-semibold tracking-wide min-w-[52px]" style={{ color }}>
        {STRENGTH_LABELS[score]}
      </span>
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}

// ─── Step 1 – Credentials ─────────────────────────────────────────────────────

function Step1Credentials({
  onSuccess,
  syncUser,
}: {
  onSuccess: () => void;
  syncUser: (variables: { variables: { name: string } }) => Promise<unknown>;
}) {
  const [fields, setFields] = useState<Step1Fields>({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncError, setSyncError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  // Set once this form has created the Firebase account, so the signed-in
  // redirect below doesn't fire while (or after) this submit finishes setup.
  const accountCreatedHere = useRef(false);

  const isValid = validateStep1(fields);

  const set = useCallback(
    (key: keyof Step1Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      setError(null);
      setSyncError(false);
    },
    [],
  );

  const handleEmailBlur = useCallback(() => {
    setFields((prev) => ({ ...prev, email: prev.email.trim() }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    setError(null);
    setSyncError(false);

    let firebaseUserCreated = false;

    try {
      await createUserWithEmailAndPassword(auth, fields.email.trim(), fields.password);
      firebaseUserCreated = true;
      accountCreatedHere.current = true;
      await updateProfile(auth.currentUser!, { displayName: fields.name.trim() });
      await syncUser({ variables: { name: fields.name.trim() } });
      onSuccess();
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/email-already-in-use":
            setError("An account with that email already exists.");
            break;
          case "auth/weak-password":
            setError("Password is too weak — please choose a stronger one.");
            break;
          case "auth/invalid-email":
            setError("That doesn't look like a valid email address.");
            break;
          case "auth/network-request-failed":
            setError("Network error — please check your connection and try again.");
            break;
          default:
            setError(`Something went wrong (${err.code}). Please try again.`);
        }
      } else if (firebaseUserCreated) {
        setSyncError(true);
        setError(
          "Your account was created but we couldn't finish setting it up. " +
            "Please try signing in — we'll complete setup automatically.",
        );
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrengthId = "password-strength-hint";

  const inputCls =
    "h-[42px] px-3 border border-border rounded-lg text-sm text-foreground " +
    "bg-card outline-none transition focus:border-primary focus:ring-2 " +
    "focus:ring-ring/10 placeholder:text-muted-foreground w-full box-border";

  // Wait for the initial auth state so a signed-in user doesn't see the form flash.
  if (authLoading) return null;

  // Already signed in (e.g. sent back to finish onboarding, or browser Back from
  // step 2): the account exists, so resume at step 2 instead of letting this form
  // create a second one. Skipped mid-submit — Firebase signs the new user in
  // before syncUser has created their User row.
  if (isAuthenticated && !loading && !accountCreatedHere.current) {
    return <Navigate to="/auth/signup?step=2" replace />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className="text-[22px] font-bold text-foreground tracking-tight mb-1">
        Create your account
      </h1>
      <p className="text-[13px] text-muted-foreground font-medium mb-7">
        Step 1 of 3 — Your credentials
      </p>

      <div className="flex flex-col gap-[18px] mb-2">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-name" className="text-[13px] font-semibold text-foreground">
            Full name
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            autoFocus
            placeholder="Ada Lovelace"
            value={fields.name}
            onChange={set("name")}
            className={inputCls}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-email" className="text-[13px] font-semibold text-foreground">
            Email address
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="ada@example.com"
            value={fields.email}
            onChange={set("email")}
            onBlur={handleEmailBlur}
            className={inputCls}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="signup-password"
            className="text-[13px] font-semibold text-foreground flex items-center gap-1.5"
          >
            Password
            <span className="font-normal text-muted-foreground text-xs">(min. 10 characters)</span>
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••••"
              value={fields.password}
              onChange={set("password")}
              aria-describedby={fields.password.length > 0 ? passwordStrengthId : undefined}
              className={`${inputCls} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground flex items-center"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {fields.password.length > 0 && (
            <PasswordStrengthBar id={passwordStrengthId} password={fields.password} />
          )}
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="text-[13px] text-destructive bg-[hsl(var(--destructive)/0.1)] border border-[hsl(var(--destructive)/0.3)] rounded-lg px-3 py-2.5 mt-4"
        >
          {error}
          {syncError && (
            <>
              {" "}
              <Link to="/auth/login" className="text-primary font-semibold hover:underline">
                Sign in here.
              </Link>
            </>
          )}
        </p>
      )}

      <button
        type="submit"
        disabled={!isValid || loading}
        className="mt-6 w-full h-11 rounded-[10px] bg-primary hover:opacity-90 active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed text-primary-foreground text-[15px] font-semibold flex items-center justify-center gap-2 transition"
      >
        {loading && <Spinner />}
        {loading && (
          <span className="sr-only" role="status">
            Creating account…
          </span>
        )}
        {loading ? null : "Continue"}
      </button>

      <p className="text-center text-[13px] text-muted-foreground mt-5">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-primary font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

// ─── Step 2 – Interests ───────────────────────────────────────────────────────

const SUBJECTS = [
  "Chemistry",
  "Physics",
  "Biology",
  "Mathematics",
  "Computer science",
  "Statistics",
  "Earth science",
  "Astronomy",
] as const;

function Step2Interests({
  onNext,
  onBack,
  saveInterests,
  interests,
  setInterests,
  loadingSaved,
}: {
  onNext: () => void;
  // Omitted for signed-in users: step 1 would only offer to create another account.
  onBack?: () => void;
  saveInterests: (opts: { variables: { interests: string[] } }) => Promise<unknown>;
  // Selection is owned by the page so navigating Back to step 2 preserves it
  // instead of resetting to empty (which would overwrite saved interests with []).
  interests: string[];
  setInterests: Dispatch<SetStateAction<string[]>>;
  // True while previously saved interests are still loading; Continue waits so it
  // can't save an empty selection over them.
  loadingSaved: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggle = useCallback(
    (subject: string) => {
      setError(null);
      setInterests((prev) =>
        prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject],
      );
    },
    [setInterests],
  );

  const handleContinue = async () => {
    if (loading || loadingSaved) return;
    setLoading(true);
    setError(null);
    try {
      // An empty array is valid — it's the "skip" path, recorded as no interests.
      await saveInterests({ variables: { interests } });
      onNext();
    } catch {
      setError("We couldn't save your choices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-[22px] font-bold text-foreground tracking-tight mb-1">
        What are you here for?
      </h1>
      <p className="text-[13px] text-muted-foreground font-medium mb-6">
        Pick a few interests — we'll tune your home feed.
      </p>

      <div className="grid grid-cols-2 gap-2 mb-6" role="group" aria-label="Interests">
        {SUBJECTS.map((subject) => {
          const selected = interests.includes(subject);
          return (
            <button
              key={subject}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(subject)}
              className={[
                "border-2 rounded-xl px-3.5 py-2.5 text-sm text-foreground text-left transition",
                selected ? "border-primary bg-accent" : "border-border bg-card hover:border-border",
              ].join(" ")}
            >
              {subject}
            </button>
          );
        })}
      </div>

      {error && (
        <p
          role="alert"
          className="text-[13px] text-destructive bg-[hsl(var(--destructive)/0.1)] border border-[hsl(var(--destructive)/0.3)] rounded-lg px-3 py-2.5 mb-4"
        >
          {error}
        </p>
      )}

      <div className="flex gap-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="flex-1 h-11 rounded-[10px] border border-border text-muted-foreground text-[15px] font-semibold hover:bg-accent active:scale-[0.98] disabled:opacity-45 transition"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={handleContinue}
          disabled={loading || loadingSaved}
          className="flex-[2] h-11 rounded-[10px] bg-primary hover:opacity-90 active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed text-primary-foreground text-[15px] font-semibold flex items-center justify-center gap-2 transition"
        >
          {loading && <Spinner />}
          {loading && (
            <span className="sr-only" role="status">
              Saving…
            </span>
          )}
          {loading ? null : "Continue"}
        </button>
      </div>
    </div>
  );
}

// ─── Step 3 – Daily goal ──────────────────────────────────────────────────────

// Must stay in sync with ALLOWED_DAILY_GOALS in the API
// (apps/api/src/graphql/mutations/user.mutations.ts).
const DAILY_GOALS = [
  { minutes: 5, label: "Casual", detail: "5 min / day" },
  { minutes: 15, label: "Regular", detail: "15 min / day", recommended: true },
  { minutes: 30, label: "Serious", detail: "30 min / day" },
  { minutes: 60, label: "Intense", detail: "1 h / day" },
] as const;

function Step3DailyGoal({
  onFinish,
  saveDailyGoal,
  dailyGoal,
  setDailyGoal,
}: {
  onFinish: () => void;
  saveDailyGoal: (opts: { variables: { dailyGoalMinutes: number } }) => Promise<unknown>;
  // Owned by the page, like interests, so the pick survives step navigation.
  dailyGoal: number;
  setDailyGoal: Dispatch<SetStateAction<number>>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      // Saving the goal also marks onboarding complete on the server.
      await saveDailyGoal({ variables: { dailyGoalMinutes: dailyGoal } });
      onFinish();
    } catch {
      setError("We couldn't save your daily goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-[22px] font-bold text-foreground tracking-tight mb-1">
        Set your daily goal
      </h1>
      <p className="text-[13px] text-muted-foreground font-medium mb-6">
        How much time do you want to commit per day? You can change this anytime.
      </p>

      <fieldset className="flex flex-col gap-2.5 mb-6">
        <legend className="sr-only">Daily goal</legend>
        {DAILY_GOALS.map((goal) => {
          const selected = dailyGoal === goal.minutes;
          return (
            <label
              key={goal.minutes}
              className={[
                "flex items-center justify-between border-2 rounded-xl px-[18px] py-3.5 cursor-pointer transition",
                // The radio input is visually hidden, so the card carries the keyboard focus ring.
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2",
                selected ? "border-primary bg-accent" : "border-border bg-card",
              ].join(" ")}
            >
              <input
                type="radio"
                name="daily-goal"
                value={goal.minutes}
                checked={selected}
                onChange={() => {
                  setError(null);
                  setDailyGoal(goal.minutes);
                }}
                className="sr-only"
              />
              <span className="flex flex-col items-start gap-0.5">
                <span className="text-[15px] font-semibold text-foreground">{goal.label}</span>
                <span className="text-[13px] text-muted-foreground">{goal.detail}</span>
              </span>
              {"recommended" in goal && goal.recommended && (
                <span className="text-[11px] font-semibold px-2 py-[3px] rounded-md bg-[hsl(var(--brand))] text-[hsl(var(--brand-foreground))]">
                  recommended
                </span>
              )}
            </label>
          );
        })}
      </fieldset>

      {error && (
        <p
          role="alert"
          className="text-[13px] text-destructive bg-[hsl(var(--destructive)/0.1)] border border-[hsl(var(--destructive)/0.3)] rounded-lg px-3 py-2.5 mb-4"
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleFinish}
        disabled={loading}
        className="w-full h-11 rounded-[10px] bg-primary hover:opacity-90 active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed text-primary-foreground text-[15px] font-semibold flex items-center justify-center gap-2 transition"
      >
        {loading && <Spinner />}
        {loading && (
          <span className="sr-only" role="status">
            Saving…
          </span>
        )}
        {loading ? null : "Start learning"}
      </button>
    </div>
  );
}

// ─── Page shell ───────────────────────────────────────────────────────────────

const VALID_STEPS = new Set<number>(STEPS);

export default function SignUpPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [syncUser] = useMutation(SYNC_CURRENT_USER);
  const [updateOnboarding] = useMutation(UPDATE_ONBOARDING);
  const [completeOnboarding] = useMutation(COMPLETE_ONBOARDING);
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  // Owned here (not in the step components) so selections survive step navigation.
  const [interests, setInterests] = useState<string[]>([]);
  // Preselect the recommended option so "Start learning" works in one click.
  // The home page's goal card falls back to the same default.
  const [dailyGoal, setDailyGoal] = useState<number>(DEFAULT_DAILY_GOAL_MINUTES);

  const rawStep = parseInt(searchParams.get("step") ?? "1", 10);
  const step: Step = (VALID_STEPS.has(rawStep) ? rawStep : 1) as Step;

  // Pre-fill step 2 with interests a returning user already saved, so Continue
  // doesn't overwrite them with []. Only fetched on step 2: during step 1 the
  // User row may not exist yet.
  const { data: savedData, loading: savedLoading } = useSavedInterestsQuery({
    skip: step !== 2 || authLoading || !isAuthenticated,
    fetchPolicy: "network-only",
  });
  const prefilled = useRef(false);
  useEffect(() => {
    const saved = savedData?.currentUser?.interests;
    if (prefilled.current || !saved) return;
    prefilled.current = true;
    // Keep picks already made in this visit (e.g. browser Back from step 3).
    setInterests((prev) => (prev.length > 0 ? prev : saved));
  }, [savedData]);

  const goToStep = useCallback(
    (next: Step) => {
      setSearchParams({ step: String(next) }, { replace: false });
    },
    [setSearchParams],
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-muted font-sans">
      <div className="w-full max-w-[420px] bg-card rounded-2xl px-9 pt-10 pb-9 shadow-[0_1px_3px_rgba(0,0,0,.06),0_8px_24px_rgba(0,0,0,.08)]">
        <ProgressBar step={step} />
        {step === 1 && <Step1Credentials onSuccess={() => goToStep(2)} syncUser={syncUser} />}
        {step === 2 && (
          <Step2Interests
            onNext={() => goToStep(3)}
            onBack={authLoading || isAuthenticated ? undefined : () => goToStep(1)}
            loadingSaved={authLoading || savedLoading}
            saveInterests={updateOnboarding}
            interests={interests}
            setInterests={setInterests}
          />
        )}
        {step === 3 && (
          <Step3DailyGoal
            onFinish={() => navigate("/", { replace: true })}
            saveDailyGoal={completeOnboarding}
            dailyGoal={dailyGoal}
            setDailyGoal={setDailyGoal}
          />
        )}
      </div>
    </div>
  );
}
