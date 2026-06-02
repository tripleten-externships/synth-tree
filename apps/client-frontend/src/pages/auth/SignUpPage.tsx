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
  if (!user) {
    throw new Error("syncCurrentUser: no authenticated user found.");
  }
 
  // 1. Push the displayName into Firebase Auth so getIdToken picks it up.
  await updateProfile(user, { displayName: payload.displayName });
 
  // 2. Get a fresh ID token to send to backend.
  const idToken = await user.getIdToken(/* forceRefresh */ true);
 
  // 3. Mirror the user into Postgres via API.
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
      `syncCurrentUser: server returned ${response.status}${text ? ` — ${text}` : ""}.`,
    );
  }
}
 
// ─── Validation helpers ───────────────────────────────────────────────────────
 
const isValidEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
 
const validateStep1 = (f: Step1Fields): boolean =>
  f.name.trim().length >= 1 &&
  isValidEmail(f.email) &&
  f.password.length >= 10;
 
// ─── Shared page styles ───────────────────────────────────────────────────────
// One static string hoisted out of all render functions so no <style> tag is
// re-injected on every render.
 
const PAGE_STYLES = `
  /* ---- Page layout ---- */
  .page-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    background: #f8fafc;
    font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
  }
  .card {
    width: 100%;
    max-width: 420px;
    background: #ffffff;
    border-radius: 16px;
    padding: 40px 36px 36px;
    box-shadow:
      0 1px 3px rgba(0,0,0,.06),
      0 8px 24px rgba(0,0,0,.08);
  }
 
  /* ---- Progress bar ---- */
  .progress-bar-root {
    display: flex;
    gap: 6px;
    width: 100%;
    margin-bottom: 36px;
  }
  .progress-segment {
    flex: 1;
    height: 4px;
    border-radius: 9999px;
    background: var(--color-track, #e4e4e7);
    overflow: hidden;
    position: relative;
  }
  .progress-fill {
    height: 100%;
    border-radius: inherit;
    width: 0;
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    background: var(--color-accent, #2563eb);
  }
  .progress-segment--done .progress-fill,
  .progress-segment--active .progress-fill { width: 100%; }
  .progress-segment--active .progress-fill { background: var(--color-accent, #2563eb); }
  .progress-segment--done  .progress-fill  { background: var(--color-accent-muted, #93c5fd); }
 
  /* ---- Step header ---- */
  .step-title {
    font-size: 22px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 4px;
    letter-spacing: -0.02em;
  }
  .step-subtitle {
    font-size: 13px;
    color: #94a3b8;
    margin: 0 0 28px;
    font-weight: 500;
  }
 
  /* ---- Form fields ---- */
  .field-stack { display: flex; flex-direction: column; gap: 18px; margin-bottom: 8px; }
  .field       { display: flex; flex-direction: column; gap: 6px; }
  .field-label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .field-hint  { font-weight: 400; color: #94a3b8; font-size: 12px; }
  .field-input {
    height: 42px;
    padding: 0 12px;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    color: #0f172a;
    background: #fff;
    transition: border-color 0.15s, box-shadow 0.15s;
    outline: none;
    width: 100%;
    box-sizing: border-box;
  }
  .field-input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,.12);
  }
  .field-input::placeholder { color: #c8d0da; }
 
  /* Password toggle */
  .field-password-wrapper { position: relative; }
  .field-input--password  { padding-right: 44px; }
  .field-eye-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: #94a3b8;
    display: flex;
    align-items: center;
  }
  .field-eye-btn:hover { color: #64748b; }
 
  /* Password strength */
  .strength-root  { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
  .strength-bars  { display: flex; gap: 4px; flex: 1; }
  .strength-bar   { flex: 1; height: 3px; border-radius: 9999px; transition: background 0.3s; }
  .strength-label { font-size: 11px; font-weight: 600; letter-spacing: 0.04em; min-width: 52px; }
 
  /* ---- Error banner ---- */
  .error-msg {
    font-size: 13px;
    color: #dc2626;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 10px 12px;
    margin: 16px 0 0;
  }
 
  /* ---- Continue button ---- */
  .btn-primary {
    margin-top: 24px;
    width: 100%;
    height: 44px;
    border-radius: 10px;
    background: #2563eb;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.15s, opacity 0.15s, transform 0.1s;
    letter-spacing: -0.01em;
  }
  .btn-primary:hover:not(:disabled)  { background: #1d4ed8; }
  .btn-primary:active:not(:disabled) { transform: scale(0.98); }
  .btn-primary:disabled              { opacity: 0.45; cursor: not-allowed; }
 
  /* ---- Sign-in prompt ---- */
  .signin-prompt {
    text-align: center;
    font-size: 13px;
    color: #94a3b8;
    margin: 20px 0 0;
  }
  .signin-link { color: #2563eb; text-decoration: none; font-weight: 600; }
  .signin-link:hover { text-decoration: underline; }
 
  /* ---- Stub cards (steps 2 / 3) ---- */
  .stub-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px 0 8px;
    gap: 12px;
  }
  .stub-icon  { font-size: 40px; line-height: 1; }
  .stub-title {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.02em;
    margin: 0;
  }
  .stub-body {
    font-size: 14px;
    color: #64748b;
    line-height: 1.6;
    margin: 0;
    max-width: 300px;
  }
 
  /* ---- Spinner ---- */
  .spinner { animation: spin 0.75s linear infinite; display: block; }
  @keyframes spin { to { transform: rotate(360deg); } }
 
  /* ---- Screen-reader only ---- */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0;
  }
`;
 
// ─── Progress bar ─────────────────────────────────────────────────────────────
 
interface ProgressBarProps {
  step: Step;
}
 
function ProgressBar({ step }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={1}
      aria-valuemax={STEPS.length}
      aria-label={`Step ${step} of ${STEPS.length}`}
      className="progress-bar-root"
    >
      {STEPS.map((n) => {
        const state = n < step ? "done" : n === step ? "active" : "upcoming";
        return (
          <div key={n} className={`progress-segment progress-segment--${state}`}>
            <div className="progress-fill" />
          </div>
        );
      })}
    </div>
  );
}
 
// ─── Password strength indicator ─────────────────────────────────────────────
 
const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"] as const;
const STRENGTH_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"] as const;
 
interface PasswordStrengthBarProps {
  id: string;
  password: string;
}
 
function PasswordStrengthBar({ id, password }: PasswordStrengthBarProps) {
  const score = (() => {
    let s = 0;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s as 0 | 1 | 2 | 3 | 4;
  })();
 
  return (
    <div id={id} className="strength-root" aria-live="polite">
      <div className="strength-bars" aria-hidden="true">
        {([1, 2, 3, 4] as const).map((n) => (
          <div
            key={n}
            className="strength-bar"
            style={{ background: n <= score ? STRENGTH_COLORS[score] : "#e4e4e7" }}
          />
        ))}
      </div>
      <span className="strength-label" style={{ color: STRENGTH_COLORS[score] }}>
        {STRENGTH_LABELS[score]}
      </span>
    </div>
  );
}
 
// ─── Spinner ──────────────────────────────────────────────────────────────────
 
function Spinner() {
  return (
    <svg
      className="spinner"
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
 
interface Step1Props {
  onSuccess: () => void;
}
 
function Step1Credentials({ onSuccess }: Step1Props) {
  const [fields, setFields] = useState<Step1Fields>({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncError, setSyncError] = useState(false);
  const [loading, setLoading] = useState(false);
 
  const isValid = validateStep1(fields);
 
  // Stable onChange factory — avoids re-creating a function per field per render
  const set = useCallback(
    (key: keyof Step1Fields) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFields((prev) => ({ ...prev, [key]: e.target.value }));
        setError(null);
        setSyncError(false);
      },
    [],
  );
 
  // Trim email on blur for a consistent stored value
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
      // 1. Create the Firebase Auth user
      await createUserWithEmailAndPassword(
        auth,
        fields.email.trim(),
        fields.password,
      );
      firebaseUserCreated = true;
 
      // 2. Mirror into Postgres — defined locally in this file above
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
        // Firebase user exists but Postgres sync failed — surface a specific
        // message so the user knows their account was created and they should
        // retry rather than re-registering (which would hit email-already-in-use).
        setSyncError(true);
        setError(
          "Your account was created but we couldn't finish setting it up. " +
          "Please try signing in — we'll complete setup automatically.",
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };
 
  const passwordStrengthId = "password-strength-hint";
 
  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className="step-title">Create your account</h1>
      <p className="step-subtitle">Step 1 of 3 — Your credentials</p>
 
      <div className="field-stack">
        {/* ── Name ── */}
        <div className="field">
          <label htmlFor="signup-name" className="field-label">
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
            className="field-input"
          />
        </div>
 
        {/* ── Email ── */}
        <div className="field">
          <label htmlFor="signup-email" className="field-label">
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
            className="field-input"
          />
        </div>
 
        {/* ── Password ── */}
        <div className="field">
          <label htmlFor="signup-password" className="field-label">
            Password
            <span className="field-hint">(min. 10 characters)</span>
          </label>
          <div className="field-password-wrapper">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••••"
              value={fields.password}
              onChange={set("password")}
              aria-describedby={
                fields.password.length > 0 ? passwordStrengthId : undefined
              }
              className="field-input field-input--password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="field-eye-btn"
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
            <PasswordStrengthBar
              id={passwordStrengthId}
              password={fields.password}
            />
          )}
        </div>
      </div>
 
      {error && (
        <p role="alert" className="error-msg">
          {error}
          {syncError && (
            <>
              {" "}
              <Link to="/auth/signin" className="signin-link">
                Sign in here.
              </Link>
            </>
          )}
        </p>
      )}
 
      <button
        type="submit"
        disabled={!isValid || loading}
        className="btn-primary"
      >
        {loading && <Spinner />}
        {loading && <span className="sr-only" role="status">Creating account…</span>}
        {loading ? null : "Continue"}
      </button>
 
      <p className="signin-prompt">
        Already have an account?{" "}
        <Link to="/auth/signin" className="signin-link">
          Sign in
        </Link>
      </p>
    </form>
  );
}
 
// ─── Step 2 stub — SYN-23 fills this in ───────────────────────────────────────
 
function Step2Stub() {
  return (
    <div className="stub-container">
      <div className="stub-icon" aria-hidden="true">🛠</div>
      <h2 className="stub-title">Profile setup</h2>
      <p className="stub-body">
        This step is coming soon (SYN-23). Your account was created successfully.
      </p>
    </div>
  );
}
 
// ─── Step 3 stub — SYN-24 fills this in ───────────────────────────────────────
 
function Step3Stub() {
  return (
    <div className="stub-container">
      <div className="stub-icon" aria-hidden="true">⚙️</div>
      <h2 className="stub-title">Preferences</h2>
      <p className="stub-body">
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
      // replace: false keeps each step in browser history so Back works naturally
      setSearchParams({ step: String(next) }, { replace: false });
    },
    [setSearchParams],
  );
 
  return (
    <div className="page-root">
      {/* Single static style injection for the entire page */}
      <style>{PAGE_STYLES}</style>
 
      <div className="card">
        <ProgressBar step={step} />
 
        {step === 1 && <Step1Credentials onSuccess={() => goToStep(2)} />}
        {step === 2 && <Step2Stub />}
        {step === 3 && <Step3Stub />}
      </div>
    </div>
  );
}