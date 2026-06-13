import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, User, Users, Building2, Briefcase, Landmark, ScrollText } from "lucide-react";
import { AuthShell } from "@/components/ih/AuthShell";
import { ihStore } from "@/lib/ih-store";

export const Route = createFileRoute("/seller-type")({
  head: () => ({ meta: [{ title: "Seller type — India Handmade" }] }),
  component: SellerType,
});

const options = [
  { v: "Individual artisan", icon: User },
  { v: "SHG / Self Help Group", icon: Users },
  { v: "Cooperative ", icon: Building2 },
  { v: "Producer Company", icon: Briefcase },
  { v: "private organisation", icon: Landmark },
  { v: "Registered with State", icon: ScrollText },
];

function SellerType() {
  const [sel, setSel] = useState("");
  return (
    <AuthShell step={3} totalSteps={5}>
      <div className="surface-card p-8">
        <h1 className="font-serif text-[28px] leading-[32px] font-medium">What kind of seller are you?</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          This helps us tailor your shop and recognitions.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {options.map((o) => {
            const active = sel === o.v;
            const Icon = o.icon;
            return (
              <button
                key={o.v}
                onClick={() => setSel(o.v)}
                className={`text-left p-4 rounded-[8px] border transition relative ${
                  active
                    ? "border-[var(--primary)] bg-[var(--cream)]"
                    : "border-[var(--border)] bg-white hover:border-[var(--primary)]/40"
                }`}
              >
                <Icon className="h-5 w-5 text-[var(--primary)]" />
                <div className="mt-3 text-sm font-medium leading-tight">{o.v}</div>
                {active && (
                  <span className="absolute top-3 right-3 h-5 w-5 rounded-full bg-[var(--primary)] grid place-items-center text-white">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <button
          
          onClick={() => { ihStore.setSeller({ sellerType: sel }); window.location.href = "/details"; }}
          className="ih-btn ih-btn-primary ih-btn-full mt-6"
        >
          Continue
        </button>
      </div>
    </AuthShell>
  );
}
