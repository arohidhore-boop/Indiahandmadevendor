import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/ih/AuthShell";
import { ihStore } from "@/lib/ih-store";

export const Route = createFileRoute("/gst")({
  head: () => ({ meta: [{ title: "GST — India Handmade" }] }),
  component: Gst,
});

function Gst() {
  const nav = useNavigate();
  const [hasGst, setHasGst] = useState<"yes" | "no" | null>(null);
  const [gst, setGst] = useState("");
  const [eid, setEid] = useState("");

  const goHome = () => {
    sessionStorage.setItem("justRegistered", "1");
    nav({ to: "/post" });
  };

  const onContinue = () => {
    ihStore.setSeller({
      gst: hasGst === "yes" && gst ? gst : undefined,
      eid: hasGst === "no" && eid ? eid : undefined,
    });
    goHome();
  };

  return (
    <AuthShell step={5} totalSteps={5}>
      <div className="surface-card p-8">
        <h1 className="font-serif text-[28px] leading-[32px] font-medium">Do you have a GST number?</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1 whitespace-pre-line">
          To sell across India, you’ll need a GST number. {"\n\n"}Don’t have one?{"\n"}No worries—Get an EID number in 5 minutes. Sell within your state.
        </p>

        <div className="mt-6 flex gap-2">
          <Choice active={hasGst === "yes"} onClick={() => setHasGst("yes")} label="Yes" />
          <Choice active={hasGst === "no"} onClick={() => setHasGst("no")} label="No" />
        </div>

        {hasGst === "yes" && (
          <label className="block mt-5 animate-fade-up">
            <span className="text-[14px] leading-[20px] tracking-[0.1px] text-[var(--muted-foreground)]">GST Number</span>
            <input
              value={gst}
              onChange={(e) => setGst(e.target.value.toUpperCase())}
              placeholder="22AAAAA0000A1Z5"
              className="mt-1.5 w-full px-4 py-3 rounded-[10px] border border-[var(--border)] bg-white tracking-wider outline-none focus:border-[var(--primary)]"
            />
          </label>
        )}

        {hasGst === "no" && (
          <label className="block mt-5 animate-fade-up">
            <span className="text-[14px] leading-[20px] tracking-[0.1px] text-[var(--muted-foreground)]">EID Number (optional)</span>
            <input
              value={eid}
              onChange={(e) => setEid(e.target.value.toUpperCase())}
              placeholder="EID Number"
              className="mt-1.5 w-full px-4 py-3 rounded-[10px] border border-[var(--border)] bg-white tracking-wider outline-none focus:border-[var(--primary)]"
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-2">
              Don’t have one?{" "}
              <a href="https://udyamregistration.gov.in/" target="_blank" rel="noreferrer" className="text-[var(--primary)] hover:underline">
                Get EID number
              </a>
            </p>
          </label>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => nav({ to: "/details" })}
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button onClick={onContinue} className="ih-btn ih-btn-primary">
            Continue
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={goHome}
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline underline-offset-4"
          >
            Skip for now
          </button>
        </div>
      </div>
    </AuthShell>
  );
}

function Choice({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-h-10 rounded-[8px] border px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-[var(--primary)] text-white border-[var(--primary)]"
          : "bg-white text-[var(--foreground)] border-[var(--border)] hover:border-[var(--primary)]"
      }`}
    >
      {label}
    </button>
  );
}

