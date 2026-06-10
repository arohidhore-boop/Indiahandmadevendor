import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  ImagePlus, CheckCircle2, XCircle, Info, Package2, Sparkles, Check, ArrowLeft,
} from "lucide-react";
import { AppShell } from "@/components/ih/AppShell";
import { ihStore } from "@/lib/ih-store";
import photoGood from "@/assets/photo-good.jpg";
import photoBad from "@/assets/photo-bad.jpg";

export const Route = createFileRoute("/add-product")({
  component: AddProduct,
  head: () => ({ meta: [{ title: "Add product — India Handmade" }] }),
});

type Kind = "ooak" | "multi" | "mto";

type FormState = {
  category: string;
  subcategory: string;
  craft: string;
  name: string;
  description: string;
  kind: Kind | null;
  images: string[];
  material: string;
  timeToMake: string;
  origin: string;
  dimensions: string;
  weight: string;
  // multi
  qty: string;
  hasOptions: "yes" | "no" | null;
  changes: string | null;
  changesOther: string;
  // mto
  mtoTime: string;
  canRequest: "yes" | "no" | null;
  customisable: string[];
  mtoNotes: string;
  // pricing
  price: string;
  hsn: string;
};

const initial: FormState = {
  category: "", subcategory: "", craft: "", name: "", description: "", kind: null,
  images: [], material: "", timeToMake: "", origin: "", dimensions: "", weight: "",
  qty: "", hasOptions: null, changes: null, changesOther: "",
  mtoTime: "", canRequest: null, customisable: [], mtoNotes: "",
  price: "", hsn: "",
};

function AddProduct() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const [f, setF] = useState<FormState>(initial);
  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((p) => ({ ...p, [k]: v }));

  const steps = useMemo(() => {
    const base = ["Basic Info", "Photos", "Craft", "Variants", "Pricing", "Review"];
    return f.kind === "ooak" ? base.filter((s) => s !== "Variants") : base;
  }, [f.kind]);
  const current = steps[step];

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).slice(0, 6 - f.images.length).forEach((file) => {
      const r = new FileReader();
      r.onload = () => setF((p) => ({ ...p, images: [...p.images, r.result as string] }));
      r.readAsDataURL(file);
    });
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else publish();
  };
  const back = () => {
    if (step > 0) setStep(step - 1);
    else nav({ to: "/post" });
  };

  const publish = () => {
    ihStore.addProduct({
      name: f.name || "Untitled craft",
      category: f.category || "Handicraft",
      subCategory: f.subcategory,
      price: Number(f.price) || 0,
      stock: f.kind === "mto" ? undefined : Number(f.qty) || 1,
      status: "active",
      imageUrl: f.images[0],
    });
    setShowCongrats(true);
  };

  const goToShop = () => {
    try { sessionStorage.setItem("justAddedProduct", "1"); } catch {}
    nav({ to: "/post" });
  };

  return (
    <AppShell>
      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-soft)] p-8 lg:p-10 min-h-[560px]">
        <div className="flex items-center justify-between mb-6">
          <button onClick={back} className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <span className="text-xs font-medium text-[var(--muted-foreground)]">
            Step {step + 1}/{steps.length}
          </span>
        </div>

        <Stepper steps={steps} current={step} />

        <h2 className="mt-6 text-[24px] font-semibold tracking-tight text-[var(--foreground)]">{current}</h2>

        <div className="mt-6">
          {current === "Basic Info" && <BasicInfo f={f} update={update} />}
          {current === "Photos" && <Photos images={f.images} onFiles={onFiles} remove={(i) => update("images", f.images.filter((_, j) => j !== i))} />}
          {current === "Craft" && <Craft f={f} update={update} />}
          {current === "Variants" && <Variants f={f} update={update} />}
          {current === "Pricing" && <Pricing f={f} update={update} />}
          {current === "Review" && <Review f={f} onEdit={setStep} steps={steps} />}
        </div>

        <div className="mt-10 flex items-center justify-between pt-6 border-t border-[var(--border)]">
          <button onClick={back} className="ih-btn ih-btn-outline">Back</button>
          <button onClick={next} className="ih-btn ih-btn-primary">
            {step === steps.length - 1 ? "Publish Product" : "Continue"}
          </button>
        </div>
      </div>

      {showCongrats && <CongratsModal onContinue={goToShop} />}

      <style>{`
        .ih-i{width:100%;padding:.7rem .9rem;border-radius:8px;border:1px solid var(--border);background:#fff;outline:none;font-size:.9rem;color:var(--foreground)}
        .ih-i:focus{border-color:var(--primary)}
        .ih-i::placeholder{color:#9aa0a6}
      `}</style>
    </AppShell>
  );
}

function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-start gap-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex-1 flex flex-col items-center gap-3">
            <span className={`h-9 w-9 rounded-full grid place-items-center text-sm font-semibold ${
              active ? "bg-[var(--primary)] text-white" :
              done ? "bg-[var(--primary)] text-white" :
              "bg-white border border-[var(--border)] text-[var(--muted-foreground)]"
            }`}>
              {done ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <span className={`text-[13px] ${active ? "font-semibold text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>
              {label}
            </span>
            <div className={`h-[2px] w-full rounded-full ${active ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`} />
          </div>
        );
      })}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">{children}</div>;
}
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2">{children}</div>
      {hint && <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">{hint}</p>}
    </div>
  );
}

const SUBCATEGORIES: Record<string, string[]> = {
  "Clothing / Apparel": ["Saree", "Kurta", "Dupatta", "Shawl", "Stole", "Lehenga", "Sherwani"],
  "Jewelry / Accessories": ["Necklace", "Earrings", "Bangles", "Rings", "Anklets", "Hairpin"],
  "Home Decor": ["Wall Art", "Sculpture", "Lamps", "Cushion Cover", "Rugs", "Vases"],
  "Kitchen / Dining": ["Cookware", "Serveware", "Cutlery", "Storage Jars", "Table Linen"],
  "Textiles": ["Bed Sheet", "Quilt", "Curtain", "Tapestry", "Fabric (per meter)"],
  "Toys": ["Wooden Toys", "Cloth Dolls", "Channapatna", "Educational"],
  "Religious / Ritual Items": ["Idols", "Diyas", "Pooja Thali", "Incense Holder", "Bells"],
};
const KINDS: { id: Kind; title: string; desc: string }[] = [
  { id: "ooak", title: "One of a kind", desc: "This is the only piece" },
  { id: "multi", title: "Multiple pieces", desc: "You have more than one" },
  { id: "mto", title: "Made to order", desc: "Made when someone orders" },
];

function BasicInfo({ f, update }: { f: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const subOptions = SUBCATEGORIES[f.category] ?? [];
  return (
    <div className="space-y-5 max-w-2xl">
      <Field label="Product category">
        <select className="ih-i" value={f.category} onChange={(e) => { update("category", e.target.value); update("subcategory", ""); }}>
          <option value="" disabled>Select product category</option>
          {Object.keys(SUBCATEGORIES).map((p) => <option key={p}>{p}</option>)}
        </select>
      </Field>
      <Field label="Subcategory" hint={!f.category ? "Select a product category first" : undefined}>
        <select className="ih-i" disabled={!f.category} value={f.subcategory} onChange={(e) => update("subcategory", e.target.value)}>
          <option value="" disabled>{f.category ? "Select subcategory" : "Select a product category first"}</option>
          {subOptions.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Field>
      <Field label="Craft type">
        <select className="ih-i" value={f.craft} onChange={(e) => update("craft", e.target.value)}>
          <option value="" disabled>Select craft</option>
          {["Madhubani", "Warli", "Pattachitra", "Gond Art", "Wood Carving", "Blue Pottery", "Block Print", "Phulkari", "Kalamkari", "Other"].map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Product name">
        <input className="ih-i" value={f.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Handwoven Silk Saree" />
      </Field>
      <Field label="Describe the product">
        <textarea className="ih-i resize-none" rows={4} value={f.description} onChange={(e) => update("description", e.target.value)} placeholder="Tell buyers what makes it special…" />
      </Field>
      <div>
        <Label>Is the product…</Label>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
          {KINDS.map((k) => {
            const active = f.kind === k.id;
            return (
              <button key={k.id} onClick={() => update("kind", k.id)}
                className={`text-left p-4 rounded-lg border-2 transition ${active ? "border-[var(--primary)] bg-[var(--cream)]" : "border-[var(--border)] bg-white hover:border-[var(--primary)]/40"}`}>
                <div className="font-semibold text-[var(--foreground)]">{k.title}</div>
                <div className="text-xs text-[var(--muted-foreground)] mt-1">{k.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Photos({ images, onFiles, remove }: { images: string[]; onFiles: (f: FileList | null) => void; remove: (i: number) => void }) {
  return (
    <div className="space-y-5 max-w-2xl">
      <div className="text-sm text-[var(--muted-foreground)]">Upload at least 3 photos</div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const src = images[i];
          return (
            <div key={i} className="relative aspect-square rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--cream)]/40 overflow-hidden">
              {src ? (
                <>
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button onClick={() => remove(i)} className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white grid place-items-center text-xs">×</button>
                </>
              ) : (
                <label className="absolute inset-0 grid place-items-center cursor-pointer text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)]">
                  <ImagePlus className="h-6 w-6" />
                  <input type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
                </label>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-2">
        <Label>Photo tips</Label>
        <div className="mt-2 grid grid-cols-2 gap-3 max-w-md">
          <div className="rounded-2xl border border-[var(--success)]/30 bg-[var(--success)]/5 overflow-hidden">
            <img src={photoGood} alt="Good product photo" className="aspect-square w-full object-cover" />
            <div className="p-3">
              <div className="flex items-center gap-1.5 text-[var(--success)] font-semibold text-[13px]"><CheckCircle2 className="h-4 w-4" /> Good</div>
              <ul className="mt-1.5 space-y-0.5 text-xs text-[var(--foreground)]/80">
                <li>• Natural lighting</li><li>• Simple background</li><li>• Full product visible</li>
              </ul>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/5 overflow-hidden">
            <img src={photoBad} alt="Bad product photo" className="aspect-square w-full object-cover" />
            <div className="p-3">
              <div className="flex items-center gap-1.5 text-[var(--destructive)] font-semibold text-[13px]"><XCircle className="h-4 w-4" /> Avoid</div>
              <ul className="mt-1.5 space-y-0.5 text-xs text-[var(--foreground)]/80">
                <li>• Blurry</li><li>• Cropped</li><li>• Cluttered</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Craft({ f, update }: { f: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  return (
    <div className="space-y-5 max-w-2xl">
      <Field label="Product material">
        <input className="ih-i" value={f.material} onChange={(e) => update("material", e.target.value)} placeholder="e.g. Pure silk, brass, mango wood" />
      </Field>
      <Field label="Time to make">
        <select className="ih-i" value={f.timeToMake} onChange={(e) => update("timeToMake", e.target.value)}>
          <option value="" disabled>Select time</option>
          {["1 day", "1 week", "1 month", "6 months", "More than 6 months"].map((o) => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="Where is it made?">
        <input className="ih-i" value={f.origin} onChange={(e) => update("origin", e.target.value)} placeholder="Village, District, State" />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Dimensions" hint="Length x Width x Height (or as applicable)">
          <input className="ih-i" value={f.dimensions} onChange={(e) => update("dimensions", e.target.value)} placeholder="e.g. 2.5m x 1.1m" />
        </Field>
        <Field label="Weight">
          <input className="ih-i" value={f.weight} onChange={(e) => update("weight", e.target.value)} placeholder="e.g. 450g" />
        </Field>
      </div>
    </div>
  );
}

function RadioCard({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition ${
        checked ? "border-[var(--primary)] bg-[var(--cream)]" : "border-[var(--border)] bg-white hover:border-[var(--primary)]/40"
      }`}>
      <span className={`h-5 w-5 rounded-full border-2 grid place-items-center ${checked ? "border-[var(--primary)]" : "border-[var(--border)]"}`}>
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />}
      </span>
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`h-9 px-4 rounded-full border text-[13px] font-medium transition ${
        active ? "border-[var(--primary)] bg-[var(--primary)] text-white" : "border-[var(--border)] bg-white hover:bg-[var(--cream)]"
      }`}>{label}</button>
  );
}
function CheckCard({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition ${
        checked ? "border-[var(--primary)] bg-[var(--cream)]" : "border-[var(--border)] bg-white hover:border-[var(--primary)]/40"
      }`}>
      <span className={`h-5 w-5 rounded-md border-2 grid place-items-center ${checked ? "border-[var(--primary)] bg-[var(--primary)] text-white" : "border-[var(--border)]"}`}>
        {checked && <Check className="h-3 w-3" />}
      </span>
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}

function Variants({ f, update }: { f: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const toggle = (item: string) =>
    update("customisable", f.customisable.includes(item) ? f.customisable.filter((x) => x !== item) : [...f.customisable, item]);

  if (!f.kind) {
    return (
      <div className="p-6 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--cream)]/40 text-center max-w-md">
        <div className="h-12 w-12 mx-auto rounded-2xl bg-[var(--cream)] text-[var(--primary)] grid place-items-center">
          <Package2 className="h-5 w-5" />
        </div>
        <div className="mt-3 font-semibold">Pick a product kind first</div>
        <div className="text-sm text-[var(--muted-foreground)] mt-1">Go back to Basic Info and tell us what type of product this is.</div>
      </div>
    );
  }

  if (f.kind === "multi") {
    return (
      <div className="space-y-6 max-w-2xl">
        <p className="text-sm text-[var(--muted-foreground)] -mt-2">Tell us about quantities and variations</p>
        <Field label="How many pieces do you have?">
          <input className="ih-i" inputMode="numeric" value={f.qty} onChange={(e) => update("qty", e.target.value.replace(/[^\d]/g, ""))} placeholder="5" />
        </Field>
        <div>
          <Label>Does this product come in different options?</Label>
          <div className="mt-2 space-y-2 max-w-md">
            <RadioCard label="Yes" checked={f.hasOptions === "yes"} onChange={() => update("hasOptions", "yes")} />
            <RadioCard label="No" checked={f.hasOptions === "no"} onChange={() => update("hasOptions", "no")} />
          </div>
        </div>
        {f.hasOptions === "yes" && (
          <div>
            <Label>What changes between them?</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Size", "Colour", "Both", "Something else"].map((c) => (
                <Chip key={c} label={c} active={f.changes === c} onClick={() => update("changes", c)} />
              ))}
            </div>
            {f.changes === "Something else" && (
              <input className="ih-i mt-3" value={f.changesOther} onChange={(e) => update("changesOther", e.target.value)} placeholder="Tell us what changes (e.g. fabric, finish)" />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-sm text-[var(--muted-foreground)] -mt-2">Let customers know about customization options</p>
      <Field label="Time to make">
        <select className="ih-i" value={f.mtoTime} onChange={(e) => update("mtoTime", e.target.value)}>
          <option value="" disabled>Select time</option>
          {["1 day", "1 week", "2 weeks", "1 month", "More than 1 month"].map((o) => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <div>
        <Label>Can customers request customisation?</Label>
        <div className="mt-2 space-y-2 max-w-md">
          <RadioCard label="Yes" checked={f.canRequest === "yes"} onChange={() => update("canRequest", "yes")} />
          <RadioCard label="No" checked={f.canRequest === "no"} onChange={() => update("canRequest", "no")} />
        </div>
      </div>
      {f.canRequest === "yes" && (
        <div>
          <Label>What can be customised?</Label>
          <div className="mt-2 space-y-2 max-w-md">
            {["Size", "Colour", "Material", "Pattern / Design", "Other"].map((c) => (
              <CheckCard key={c} label={c} checked={f.customisable.includes(c)} onChange={() => toggle(c)} />
            ))}
          </div>
        </div>
      )}
      <Field label="More details" hint="Anything else customers should know">
        <textarea className="ih-i resize-none" rows={4} value={f.mtoNotes} onChange={(e) => update("mtoNotes", e.target.value)} placeholder="e.g. Min order quantity, shipping window, deposit terms…" />
      </Field>
    </div>
  );
}

function Pricing({ f, update }: { f: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const num = Number(f.price) || 0;
  const gst = Math.round(num * 0.05);
  const customer = num + gst;
  const youGet = num - Math.round(num * 0.08);
  return (
    <div className="space-y-5 max-w-2xl">
      <Field label="Selling price (₹)" hint="Your asking price before tax">
        <input className="ih-i" inputMode="numeric" value={f.price} onChange={(e) => update("price", e.target.value.replace(/[^\d]/g, ""))} placeholder="0" />
      </Field>
      <div className="p-4 rounded-2xl bg-[var(--cream)] border border-[var(--primary)]/10">
        <div className="text-[12px] font-semibold text-[var(--primary)] uppercase tracking-wider">What you'll receive</div>
        <Row label="Customer price" value={`₹${customer.toLocaleString("en-IN")}`} />
        <Row label={<span className="inline-flex items-center gap-1">GST (5%) <Info className="h-3 w-3" /></span>} value={`₹${gst.toLocaleString("en-IN")}`} />
        <div className="border-t border-[var(--primary)]/15 mt-2 pt-2">
          <Row label={<span className="font-semibold text-[var(--foreground)]">You will receive</span>}
               value={<span className="font-bold text-[var(--primary)] text-lg">₹{youGet.toLocaleString("en-IN")}</span>} />
        </div>
      </div>
      <Field label="HSN Code">
        <input className="ih-i" value={f.hsn} onChange={(e) => update("hsn", e.target.value)} placeholder="6 or 8 digit code" />
      </Field>
    </div>
  );
}
function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-[13.5px]">
      <span className="text-[var(--muted-foreground)]">{label}</span>
      <span className="text-[var(--foreground)] tabular-nums">{value}</span>
    </div>
  );
}

function Review({ f, onEdit, steps }: { f: FormState; onEdit: (n: number) => void; steps: string[] }) {
  const idx = (label: string) => steps.indexOf(label);
  const price = Number(f.price) || 0;
  return (
    <div className="space-y-3 max-w-2xl">
      <div className="rounded-2xl bg-white border border-[var(--border)] overflow-hidden">
        <div className="aspect-[4/3] bg-[var(--cream)] grid place-items-center text-[var(--primary)]">
          {f.images[0] ? <img src={f.images[0]} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="h-8 w-8" />}
        </div>
        <div className="p-4">
          <div className="text-xs text-[var(--muted-foreground)] inline-flex items-center gap-1.5">
            <Package2 className="h-3 w-3" /> {f.category || "—"}{f.craft ? ` · ${f.craft}` : ""}
          </div>
          <div className="mt-1 text-[18px] font-semibold tracking-tight">{f.name || "Product Name"}</div>
          <div className="mt-1 text-[var(--primary)] font-semibold">₹{price.toLocaleString("en-IN")}</div>
        </div>
      </div>
      <ReviewSection title="Basic details" onEdit={() => onEdit(idx("Basic Info"))} items={[
        ["Category", f.category || "—"], ["Subcategory", f.subcategory || "—"], ["Craft", f.craft || "—"],
        ["Kind", f.kind ? KINDS.find((k) => k.id === f.kind)!.title : "—"],
      ]} />
      <ReviewSection title="Photos" onEdit={() => onEdit(idx("Photos"))} items={[["Photos uploaded", `${f.images.length} photo${f.images.length === 1 ? "" : "s"}`]]} />
      <ReviewSection title="About the craft" onEdit={() => onEdit(idx("Craft"))} items={[["Material", f.material || "—"], ["Location", f.origin || "—"], ["Time to make", f.timeToMake || "—"]]} />
      <ReviewSection title="Pricing" onEdit={() => onEdit(idx("Pricing"))} items={[["Selling price", `₹${price.toLocaleString("en-IN")}`], ["HSN", f.hsn || "—"]]} />
    </div>
  );
}
function ReviewSection({ title, items, onEdit }: { title: string; items: [string, string][]; onEdit: () => void }) {
  return (
    <div className="rounded-2xl bg-white border border-[var(--border)] p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-sm">{title}</div>
        <button onClick={onEdit} className="text-xs text-[var(--primary)] font-medium">Edit</button>
      </div>
      <div className="space-y-1">
        {items.map(([k, v]) => (
          <div key={k} className="flex justify-between text-[13px]">
            <span className="text-[var(--muted-foreground)]">{k}</span>
            <span className="text-[var(--foreground)]">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CongratsModal({ onContinue }: { onContinue: () => void }) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 backdrop-blur-sm px-6 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-[var(--primary)] text-white grid place-items-center">
          <Sparkles className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-center text-[22px] font-bold tracking-tight">Congratulations 🎉</h2>
        <p className="mt-2 text-center text-sm text-[var(--muted-foreground)]">
          You've added your first product. Your shop is now live on India Handmade.
        </p>
        <div className="mt-6">
          <button onClick={onContinue} className="ih-btn ih-btn-primary ih-btn-full">Continue to your shop</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
