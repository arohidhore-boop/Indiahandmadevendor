import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthShell } from "@/components/ih/AuthShell";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — India Handmade" }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  return (
    <AuthShell>
      <div className="surface-card p-8">
        <h1 className="font-serif text-[28px] leading-[32px] font-medium">Welcome back</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Sign in to continue selling on India Handmade.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            nav({ to: "/post" });
          }}
          className="mt-6 space-y-4"
        >
          <Field label="Email">
            <input type="email" placeholder="you@example.in" className="ih-input" defaultValue="demo@indiahandmade.in" />
          </Field>
          <Field label="Password">
            <div className="relative">
              <input type={show ? "text" : "password"} className="ih-input pr-10" defaultValue="demo1234" />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
          <div className="text-right">
            <a className="text-sm text-[var(--primary)] hover:underline">Forgot password?</a>
          </div>
          <button type="button" onClick={() => nav({ to: "/post" })} className="ih-btn ih-btn-primary ih-btn-full">
            Sign In
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-[var(--muted-foreground)]">
          New here?{" "}
          <Link to="/signup" className="text-[var(--primary)] font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
      <style>{`.ih-input{width:100%;padding:.75rem 1rem;border-radius:10px;border:1px solid var(--border);background:#fff;outline:none;font-size:.95rem}.ih-input:focus{border-color:var(--primary)}`}</style>
    </AuthShell>
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
