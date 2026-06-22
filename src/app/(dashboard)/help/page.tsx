"use client";

import { useState } from "react";
import { ChevronDown, Phone } from "lucide-react";

const faqs = [
  { q: "How do I add my first product?", a: "Go to Products → Add product. Upload up to 6 photos, fill the details, and click Publish. Drafts are saved automatically." },
  { q: "When will I receive payouts?", a: "Payouts are made every 15 days to your registered bank account. You can track them in the Earnings page." },
  { q: "How do I get verified by Ministry of Textiles?", a: "Visit your Profile, click Add Recognition, and upload your certificate. Our team reviews within 5 working days." },
  { q: "Can I sell without GST?", a: "Yes. GST is optional for many artisans. You can add it later from your Profile when required." },
];

export default function Help() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      <div>
        <h1 className="font-serif text-[28px] leading-[32px]">Help &amp; support</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">We&apos;re here to help you grow your craft.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 surface-card divide-y divide-[var(--border)]">
          <div className="p-6">
            <h3 className="font-serif text-[20px] leading-[24px] font-medium">Frequently asked questions</h3>
          </div>
          {faqs.map((f, i) => (
            <div key={i}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full px-6 py-4 flex items-center justify-between text-left">
                <span className="font-medium">{f.q}</span>
                <ChevronDown className={`h-4 w-4 transition ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p className="px-6 pb-5 text-sm text-[var(--muted-foreground)]">{f.a}</p>}
            </div>
          ))}
        </div>

        <div className="space-y-5">
          <div className="surface-card p-6">
            <h3 className="font-serif text-[20px] leading-[24px] font-medium">Helpline</h3>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">Mon – Sat, 9am – 7pm IST</p>
            <a href="tel:18002700400" className="mt-4 inline-flex items-center gap-2 text-2xl font-serif text-[var(--primary)]">
              <Phone className="h-5 w-5" /> 1800-270-0400
            </a>
          </div>
          <form className="surface-card p-6 space-y-3" onSubmit={(e) => e.preventDefault()}>
            <h3 className="font-serif text-[20px] leading-[24px] font-medium">Contact support</h3>
            <input placeholder="Subject" className="w-full px-4 py-2.5 rounded-[10px] border border-[var(--border)] bg-white outline-none focus:border-[var(--primary)] text-sm" />
            <textarea rows={4} placeholder="How can we help?" className="w-full px-4 py-2.5 rounded-[10px] border border-[var(--border)] bg-white outline-none focus:border-[var(--primary)] text-sm resize-none" />
            <button className="ih-btn ih-btn-primary ih-btn-full">Send message</button>
          </form>
        </div>
      </div>
    </>
  );
}
