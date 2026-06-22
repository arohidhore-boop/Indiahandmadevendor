"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AuthShell } from "@/components/ih/auth-shell";
import { useStore } from "@/lib/store";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const CHEVRON_BG = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 1rem center",
};

function In({
  label, v, on, ph, type = "text",
}: { label: string; v: string; on: (v: string) => void; ph?: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-[14px] leading-[20px] tracking-[0.1px] font-medium text-[var(--foreground)]">{label}</span>
      <input
        type={type}
        value={v}
        onChange={(e) => on(e.target.value)}
        placeholder={ph}
        className="mt-1.5 w-full px-4 py-3 rounded-[10px] border border-[var(--border)] bg-white outline-none focus:border-[var(--primary)]"
      />
    </label>
  );
}

export default function Details() {
  const router = useRouter();
  const { setSeller, resetOnboarding } = useStore();
  const [f, setF] = useState({
    name: "Neha Kumar",
    shopName: "Samba Sakhi Crafts",
    city: "Jaipur",
    state: "Rajasthan",
    primaryCraft: "Handicraft",
    mobile: "9876543210",
  });
  return (
    <AuthShell step={4} totalSteps={5}>
      <div className="surface-card p-8">
        <h1 className="font-serif text-[28px] leading-[32px] font-medium">Tell us about your business</h1>
        <div className="mt-6 space-y-4">
          <In label="Your name" v={f.name} on={(v) => setF({ ...f, name: v })} ph="Neha Kumar" />
          <In label="Shop name" v={f.shopName} on={(v) => setF({ ...f, shopName: v })} ph="Samba Sakhi Crafts" />
          <label className="block">
            <span className="text-[14px] leading-[20px] tracking-[0.1px] font-medium text-[var(--foreground)]">Phone number</span>
            <div className="mt-1.5 flex items-center rounded-[10px] border border-[var(--border)] bg-white focus-within:border-[var(--primary)] overflow-hidden">
              <span className="px-3 text-[14px] text-[var(--muted-foreground)] border-r border-[var(--border)] py-3 bg-white select-none">+91</span>
              <input
                type="tel"
                value={f.mobile}
                onChange={(e) => setF({ ...f, mobile: e.target.value })}
                placeholder="10-digit mobile number"
                className="flex-1 px-4 py-3 outline-none bg-white text-[14px]"
              />
            </div>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[14px] leading-[20px] tracking-[0.1px] font-medium text-[var(--foreground)]">State</span>
              <select
                value={f.state}
                onChange={(e) => setF({ ...f, state: e.target.value })}
                className="mt-1.5 w-full px-4 pr-10 py-3 rounded-[10px] border border-[var(--border)] bg-white outline-none focus:border-[var(--primary)] appearance-none"
                style={CHEVRON_BG}
              >
                <option value="">Select state</option>
                {STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <In label="City" v={f.city} on={(v) => setF({ ...f, city: v })} ph="Jaipur" />
          </div>
          <label className="block">
            <span className="text-[14px] leading-[20px] tracking-[0.1px] font-medium text-[var(--foreground)]">Craft type</span>
            <select
              value={f.primaryCraft}
              onChange={(e) => setF({ ...f, primaryCraft: e.target.value })}
              className="mt-1.5 w-full px-4 pr-10 py-3 rounded-[10px] border border-[var(--border)] bg-white outline-none focus:border-[var(--primary)] appearance-none"
              style={CHEVRON_BG}
            >
              <option value="">Handicraft / Handloom</option>
              {["Handloom", "Handicraft", "Both"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              setSeller({
                ...f,
                initials:
                  f.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "S",
              });
              resetOnboarding();
              if (typeof window !== "undefined") sessionStorage.setItem("justRegistered", "1");
              router.push("/post");
            }}
            className="ih-btn ih-btn-primary ih-btn-full"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </AuthShell>
  );
}
