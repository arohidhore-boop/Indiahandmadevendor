import { createFileRoute } from "@tanstack/react-router";
import { Plus, Award, Upload } from "lucide-react";
import { AppShell } from "@/components/ih/AppShell";
import { useIH } from "@/lib/ih-store";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — India Handmade" }] }),
  component: Profile,
});

function Profile() {
  const { seller } = useIH();
  return (
    <AppShell>
      <div>
        <h1 className="font-serif text-[26px]">Your profile</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Information shown to buyers.</p>
      </div>

      <div className="surface-card p-6 flex items-center gap-5">
        <div className="h-20 w-20 rounded-full bg-[var(--primary)] text-white grid place-items-center font-serif text-3xl">
          {seller?.initials ?? "SM"}
        </div>
        <div className="flex-1">
          <div className="font-serif text-2xl">{seller?.name ?? "Samba Sakhi"}</div>
          <div className="text-sm text-[var(--muted-foreground)]">{seller?.sellerType}</div>
        </div>
        <button className="ih-btn ih-btn-outline">
          <Upload className="h-4 w-4" /> Upload photo
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="surface-card p-6 space-y-4">
          <h3 className="font-serif text-xl">Business details</h3>
          <Row label="Shop name" v={seller?.shopName} />
          <Row label="City" v={seller?.city} />
          <Row label="State" v={seller?.state} />
          <Row label="Primary craft" v={seller?.primaryCraft} />
          <Row label="GSTIN" v={seller?.gst ?? "Not added"} />
          <Row label="Bank account" v="HDFC •••• 4521" />
        </div>

        <div className="surface-card p-6">
          <h3 className="font-serif text-xl">Your story</h3>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Tell buyers about your craft and journey.</p>
          <textarea
            rows={8}
            placeholder="We are a producer company from Jaipur weaving Banarasi sarees passed down through three generations…"
            className="mt-4 w-full px-4 py-3 rounded-[10px] border border-[var(--border)] bg-white outline-none focus:border-[var(--primary)] text-sm resize-none"
          />
          <button className="ih-btn ih-btn-primary mt-3">
            Save story
          </button>
        </div>
      </div>

      <div className="surface-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl">Recognitions</h3>
          <button className="ih-btn ih-btn-outline">
            <Plus className="h-4 w-4" /> Add recognition
          </button>
        </div>
        <ul className="mt-4 grid sm:grid-cols-2 gap-3">
          {[
            { t: "National Handloom Award 2022", b: "Ministry of Textiles" },
            { t: "GI Tag — Banarasi Brocade", b: "Geographical Indications Registry" },
          ].map((r) => (
            <li key={r.t} className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--cream)]/40">
              <div className="h-10 w-10 rounded-full bg-[var(--primary)]/10 grid place-items-center">
                <Award className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <div>
                <div className="font-medium text-sm">{r.t}</div>
                <div className="text-xs text-[var(--muted-foreground)]">{r.b}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}

function Row({ label, v }: { label: string; v?: string }) {
  return (
    <div className="flex items-center justify-between text-sm border-b border-[var(--border)] pb-2 last:border-0 last:pb-0">
      <span className="text-[var(--muted-foreground)]">{label}</span>
      <span className="font-medium">{v ?? "—"}</span>
    </div>
  );
}
