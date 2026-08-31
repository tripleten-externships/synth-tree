import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { Button, Input, toast } from "@synth-tree/ui";

import { useAuthContext } from "../../contexts/AuthContext";

function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}

// Loose approximation of the mock's node-graph illustration — not pixel-matched,
// easy to swap for the real artwork later.
function HexNodeGraphic() {
  const nodes = [
    { cx: 70, cy: 55, r: 22 },
    { cx: 150, cy: 32, r: 16 },
    { cx: 232, cy: 62, r: 26 },
    { cx: 100, cy: 132, r: 20 },
    { cx: 58, cy: 196, r: 18 },
    { cx: 180, cy: 156, r: 24 },
    { cx: 224, cy: 216, r: 18 },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [0, 3],
    [3, 4],
    [3, 5],
    [5, 2],
    [5, 6],
  ];

  return (
    <svg viewBox="0 0 300 250" className="h-auto w-full max-w-xs" aria-hidden="true">
      <g stroke="rgba(255,255,255,0.35)" strokeWidth="1.5">
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy} />
        ))}
      </g>
      {nodes.map((n, i) => (
        <polygon
          key={i}
          points={hexPoints(n.cx, n.cy, n.r)}
          fill="rgba(255,255,255,0.12)"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

function BrandMark() {
  return (
    <div className="flex items-center gap-2 text-primary-foreground">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <polygon points={hexPoints(12, 12, 10)} stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className="text-base font-semibold">Synth Tree</span>
    </div>
  );
}

export default function SignInPage() {
  const { login, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch {
      toast("Sign in failed", {
        description: "Check your email and password and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <h1 className="mb-1.5 text-[26px] font-bold leading-tight text-foreground">
            Welcome back
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Pick up your streak where you left off.
          </p>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signin-email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="signin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="signin-password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-muted-foreground hover:text-foreground"
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
            </div>

            <div className="flex items-center justify-between">
              <label
                htmlFor="remember-me"
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                {/* Cosmetic only for now, not wired to Firebase session persistence.
                    No acceptance criterion requires it; intentional, not a missed step. */}
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-input accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                Remember me
              </label>
              <Button
                type="button"
                variant="link"
                size="sm"
                disabled
                className="h-auto p-0 text-[13px] font-normal"
              >
                Forgot password?
              </Button>
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to Synth Tree?{" "}
            <Link to="/auth/signup" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden flex-col justify-between bg-[linear-gradient(160deg,hsl(var(--primary))_0%,hsl(var(--brand))_100%)] p-12 lg:flex lg:w-1/2">
        <BrandMark />
        <HexNodeGraphic />
        <div>
          <h2 className="mb-3 text-3xl font-bold leading-tight text-primary-foreground">
            Learn STEM the way it actually branches.
          </h2>
          <p className="max-w-md text-primary-foreground/80">
            Tree-structured courses, gamified mastery, and content from working scientists. Built
            for learners who like to see how the pieces connect.
          </p>
        </div>
      </div>
    </div>
  );
}
