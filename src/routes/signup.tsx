import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthShell } from "@/components/ih/AuthShell";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — India Handmade" }] }),
  component: Signup,
});

function Signup() {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const nav = useNavigate();
  return (
    <AuthShell step={1} totalSteps={5}>
      <div className="surface-card p-8">
        <h1 className="font-serif text-[28px] leading-[32px] font-medium">Create your account</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          A few quick steps to start selling your craft.
        </p>

        <div className="mt-6 space-y-2.5">
          <p className="text-xs text-center text-[var(--muted-foreground)] mb-1">Social login coming soon</p>
          <SocialButton
            label="Continue with Google"
            icon={
              <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden>
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.9 6.5 29.2 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.3-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.9 6.5 29.2 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 43.5c5.1 0 9.8-2 13.3-5.2l-6.1-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.3 0-9.7-3.1-11.3-7.4l-6.5 5C9.6 39 16.2 43.5 24 43.5z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.3l6.1 5.2c-.4.4 6.7-4.9 6.7-14.5 0-1.2-.1-2.4-.4-3.5z"/>
              </svg>
            }
          />
          <SocialButton
            label="Continue with Facebook"
            icon={
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
                <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7v-3.5h3.1V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.3h3.4l-.5 3.5h-2.9V24A12 12 0 0 0 24 12z"/>
              </svg>
            }
          />
          <SocialButton
            label="Continue with Apple"
            icon={
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden fill="currentColor">
                <path d="M16.4 12.7c0-2.4 2-3.6 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9s-1.9-.9-3.2-.8c-1.6 0-3.2 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.5 1.2-.1 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0-.1-2.6-1-2.6-3.9zM14 4.8c.7-.8 1.1-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1 0 2.2-.6 2.9-1.4z"/>
              </svg>
            }
          />
        </div>

        <div className="flex items-center gap-3 my-6">
          <span className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-[14px] leading-[20px] tracking-[0.1px] text-[var(--muted-foreground)]">or</span>
          <span className="flex-1 h-px bg-[var(--border)]" />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            nav({ to: "/verify" });
          }}
          className="space-y-4"
        >
          <Field label="Full name">
            <input type="text" className="ih-input" placeholder="Your full name" required />
          </Field>
          <Field label="Email">
            <input type="email" className="ih-input" placeholder="you@example.in" defaultValue="demo@indiahandmade.in" required />
          </Field>
          <Field label="Password">
            <div className="relative">
              <input type={showPwd ? "text" : "password"} className="ih-input pr-10" defaultValue="demo1234" required minLength={8} />
              <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" aria-label={showPwd ? "Hide password" : "Show password"}>
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
          <Field label="Confirm password">
            <div className="relative">
              <input type={showConfirm ? "text" : "password"} className="ih-input pr-10" defaultValue="demo1234" required minLength={8} />
              <button type="button" onClick={() => setShowConfirm((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" aria-label={showConfirm ? "Hide password" : "Show password"}>
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
          <button type="submit" className="ih-btn ih-btn-primary ih-btn-full">
            Continue
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-[var(--muted-foreground)]">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--primary)] font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </AuthShell>
  );
}

function SocialButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="w-full min-h-10 rounded-[10px] border border-[var(--border)] bg-white hover:bg-[var(--cream)] transition flex items-center justify-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {icon}
      {label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[14px] leading-[20px] tracking-[0.1px] text-[var(--muted-foreground)]">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
