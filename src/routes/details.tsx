import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/ih/AuthShell";
import { ihStore } from "@/lib/ih-store";

export const Route = createFileRoute("/details")({
  head: () => ({ meta: [{ title: "Business details — India Handmade" }] }),
  component: Details,
});

function Details() {
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", shopName: "", city: "", state: "", primaryCraft: "" });
  return (
    <AuthShell step={4} totalSteps={5}>
      <div className="surface-card p-8">
        <h1 className="font-serif text-3xl">Tell us about your business</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          This information appears on your shop and helps buyers trust you.
        </p>
        <form
          onSubmit={(e) => { e.preventDefault(); ihStore.setSeller({ ...f, initials: f.name.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase() || "S" }); nav({ to: "/gst" }); }}
          className="mt-6 space-y-4"
        >
          <In label="Your name" v={f.name} on={(v)=>setF({...f, name:v})} ph="Neha Kumar" />
          <In label="Shop name" v={f.shopName} on={(v)=>setF({...f, shopName:v})} ph="Samba Sakhi Crafts" />
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">State</span>
              <select value={f.state} onChange={(e)=>setF({...f, state:e.target.value})}
                className="mt-1.5 w-full px-4 py-3 rounded-[10px] border border-[var(--border)] bg-white outline-none focus:border-[var(--primary)]">
                <option value="">Select state</option>
                {["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"].map(s=>(<option key={s}>{s}</option>))}
              </select>
            </label>
            <In label="City" v={f.city} on={(v)=>setF({...f, city:v})} ph="Jaipur" />
          </div>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Craft type</span>
            <select value={f.primaryCraft} onChange={(e)=>setF({...f, primaryCraft:e.target.value})}
              className="mt-1.5 w-full px-4 py-3 rounded-[10px] border border-[var(--border)] bg-white outline-none focus:border-[var(--primary)]">
              <option value="">Choose your craft</option>
              {["Handloom","Handicraft","Both"].map(c=>(<option key={c}>{c}</option>))}
            </select>
          </label>
          <button className="ih-btn ih-btn-primary ih-btn-full">
            Continue
          </button>
        </form>
      </div>
    </AuthShell>
  );
}

function In({ label, v, on, ph }: { label: string; v: string; on: (v: string)=>void; ph?: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">{label}</span>
      <input value={v} onChange={(e)=>on(e.target.value)} placeholder={ph}
        className="mt-1.5 w-full px-4 py-3 rounded-[10px] border border-[var(--border)] bg-white outline-none focus:border-[var(--primary)]" />
    </label>
  );
}
