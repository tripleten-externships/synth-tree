import { useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../../lib/firebase";

// ─── Types ────────────────────────────────────────────────────────────────────

const STEPS = [1, 2, 3] as const;
type Step = (typeof STEPS)[number];

interface Step1Fields {
  name: string;
  email: string;
  password: string;
}

interface SyncUserPayload {
  displayName: string;
}

async function syncCurrentUser(payload: SyncUserPayload): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("syncCurrentUser: no authenticated user found.");

  await updateProfile(user, { displayName: payload.displayName });
  const idToken = await user.getIdToken(true);

  const response = await fetch("/api/users/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: payload.displayName,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `syncCurrentUser: server returned ${response.status}${text ? ` — ${text}` : ""}.`
    );
  }
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
                isDone ? "w-full bg-blue-300" : isActive ? "w-full bg-blue-600" : "w-0",
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

// Tailwind can't construct dynamic class names at runtime, so we use inline
// styles only for the data-driven color values here.
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
            style={{ background: n <= score ? color : "#e4e4e7" }}
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

function Step1Credentials({ onSuccess }: { onSuccess: () => void }) {
  const [fields, setFields] = useState<Step1Fields>({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncError, setSyncError] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = validateStep1(fields);

  const set = useCallback(
    (key: keyof Step1Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      setError(null);
      setSyncError(false);
    },
    []
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
      await syncCurrentUser({ displayName: fields.name.trim() });
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
            "Please try signing in — we'll complete setup automatically."
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrengthId = "password-strength-hint";

  // Shared input class string
  const inputCls =
    "h-[42px] px-3 border border-slate-200 rounded-lg text-sm text-slate-900 " +
    "bg-white outline-none transition focus:border-blue-600 focus:ring-2 " +
    "focus:ring-blue-600/10 placeholder:text-slate-300 w-full box-border";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className="text-[22px] font-bold text-slate-900 tracking-tight mb-1">
        Create your account
      </h1>
      <p className="text-[13px] text-slate-400 font-medium mb-7">
        Step 1 of 3 — Your credentials
      </p>

      <div className="flex flex-col gap-[18px] mb-2">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-name" className="text-[13px] font-semibold text-gray-700">
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
          <label htmlFor="signup-email" className="text-[13px] font-semibold text-gray-700">
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
          <label htmlFor="signup-password" className="text-[13px] font-semibold text-gray-700 flex items-center gap-1.5">
            Password
            <span className="font-normal text-slate-400 text-xs">(min. 10 characters)</span>
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 flex items-center"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
        <p role="alert" className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mt-4">
          {error}
          {syncError && (
            <>
              {" "}
              <Link to="/auth/signin" className="text-blue-600 font-semibold hover:underline">
                Sign in here.
              </Link>
            </>
          )}
        </p>
      )}

      <button
        type="submit"
        disabled={!isValid || loading}
        className="mt-6 w-full h-11 rounded-[10px] bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed text-white text-[15px] font-semibold flex items-center justify-center gap-2 transition"
      >
        {loading && <Spinner />}
        {loading && <span className="sr-only" role="status">Creating account…</span>}
        {loading ? null : "Continue"}
      </button>

      <p className="text-center text-[13px] text-slate-400 mt-5">
        Already have an account?{" "}
        <Link to="/auth/signin" className="text-blue-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

// ─── Step 2 stub ──────────────────────────────────────────────────────────────

function Step2Stub() {
  return (
    <div className="flex flex-col items-center text-center pt-5 pb-2 gap-3">
      <span className="text-4xl leading-none" aria-hidden="true">🛠</span>
      <h2 className="text-xl font-bold text-slate-900 tracking-tight m-0">Profile setup</h2>
      <p className="text-sm text-slate-500 leading-relaxed m-0 max-w-[300px]">
        This step is coming soon (SYN-23). Your account was created successfully.
      </p>
    </div>
  );
}

// ─── Step 3 stub ──────────────────────────────────────────────────────────────

function Step3Stub() {
  return (
    <div className="flex flex-col items-center text-center pt-5 pb-2 gap-3">
      <span className="text-4xl leading-none" aria-hidden="true">⚙️</span>
      <h2 className="text-xl font-bold text-slate-900 tracking-tight m-0">Preferences</h2>
      <p className="text-sm text-slate-500 leading-relaxed m-0 max-w-[300px]">
        This step is coming soon (SYN-24).
      </p>
    </div>
  );
}

// ─── Page shell ───────────────────────────────────────────────────────────────

const VALID_STEPS = new Set<number>(STEPS);

export default function SignUpPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawStep = parseInt(searchParams.get("step") ?? "1", 10);
  const step: Step = (VALID_STEPS.has(rawStep) ? rawStep : 1) as Step;

  const goToStep = useCallback(
    (next: Step) => {
      setSearchParams({ step: String(next) }, { replace: false });
    },
    [setSearchParams]
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-slate-50 font-sans">
      <div className="w-full max-w-[420px] bg-white rounded-2xl px-9 pt-10 pb-9 shadow-[0_1px_3px_rgba(0,0,0,.06),0_8px_24px_rgba(0,0,0,.08)]">
        <ProgressBar step={step} />
        {step === 1 && <Step1Credentials onSuccess={() => goToStep(2)} />}
        {step === 2 && <Step2Stub />}
        {step === 3 && <Step3Stub />}
      </div>
    </div>
  );
}