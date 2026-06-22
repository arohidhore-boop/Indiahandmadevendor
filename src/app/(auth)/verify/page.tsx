"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/ih/auth-shell";

export default function Verify() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(45);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const update = (i: number, v: string) => {
    const c = v.replace(/\D/g, "").slice(0, 1);
    const next = [...digits];
    next[i] = c;
    setDigits(next);
    if (c && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <AuthShell step={2} totalSteps={5}>
      <div className="surface-card p-8 text-center">
        <h1 className="font-serif text-[28px] leading-[32px] font-medium">Verify your email</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-2">
          We sent a 6-digit code to your inbox.
        </p>
        <p className="text-[12px] leading-[16px] text-[var(--primary)] mt-1">
          Demo: enter any 6 digits to continue
        </p>
        <div className="mt-7 flex items-center justify-center gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => update(i, e.target.value)}
              className="h-14 w-12 text-center text-[24px] font-serif rounded-[10px] border border-[var(--border)] bg-white focus:border-[var(--primary)] outline-none"
            />
          ))}
        </div>
        <button
          onClick={() => router.push("/seller-type")}
          className="ih-btn ih-btn-primary ih-btn-full mt-7"
        >
          Verify and continue
        </button>
        <p className="mt-4 text-sm text-[var(--muted-foreground)]">
          {timer > 0 ? (
            <>Resend in {timer}s</>
          ) : (
            <button onClick={() => setTimer(45)} className="text-[var(--primary)] hover:underline">
              Resend code
            </button>
          )}
        </p>
      </div>
    </AuthShell>
  );
}
