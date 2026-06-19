import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";
import { GovBar } from "./GovBar";
import { BrandMark } from "./BrandMark";

export function AuthShell({
  step,
  totalSteps,
  children,
}: {
  step?: number;
  totalSteps?: number;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--cream)]">
      <GovBar />
      <header className="h-[72px] bg-white border-b border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
        <BrandMark />
        {step != null && totalSteps != null && (
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full ${i < step ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`}
              />
            ))}
          </div>
        )}
        </div>
      </header>
      <main className="flex-1 grid place-items-center px-4 py-12">
        <div className="w-full max-w-[460px] animate-fade-up">{children}</div>
      </main>
      <Toaster />
    </div>
  );
}
