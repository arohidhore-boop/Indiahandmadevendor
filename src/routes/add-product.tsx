import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
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
  originState: string;
  originCity: string;
  dimensions: string;
  weight: string;
  // multi
  qty: string;
  hasOptions: "yes" | "no" | null;
  changes: string | null;
  changesOther: string;
  sizes: { label: string; qty: string }[];
  colours: { label: string; qty: string }[];
  // mto
  madeToOrder: "yes" | "no" | null;
  mtoTime: string;
  canRequest: "yes" | "no" | null;
  customisable: string[];
  constraints: Record<string, string>;
  mtoNotes: string;
  // pricing
  price: string;
  hsn: string;
  gstRate: string;
};

const initial: FormState = {
  category: "Handloom",
  subcategory: "Banarasi",
  craft: "Banarasi Silk Weaving",
  name: "Hand-woven Banarasi Silk Dupatta",
  description: "Handcrafted using traditional pit-loom technique by master weavers in Varanasi. Features intricate zari work with floral motifs. Each piece takes 3–5 days to weave.",
  kind: "single",
  images: [],
  material: "",
  timeToMake: "",
  origin: "",
  originState: "",
  originCity: "",
  dimensions: "",
  weight: "",
  qty: "",
  hasOptions: null,
  changes: "",
  changesOther: "",
  sizes: [],
  colours: [],

  madeToOrder: null,
  mtoTime: "",
  canRequest: null,
  customisable: [],
  constraints: {},
  mtoNotes: "",
  price: "2400",
  hsn: "50077200",
  gstRate: "5",
};

function AddProduct() {
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
    else window.location.href = "/post";
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
    window.location.href = "/post";
  };

  return (
    <AppShell>
      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-soft)] p-8 lg:p-10 min-h-[560px]">
        <Stepper steps={steps} current={step} />

        <h2 className="mt-6 text-[24px] leading-[28px] font-medium text-[var(--foreground)]">
          {current === "Variants"
            ? f.kind === "mto" ? "Made to order"
            : f.kind === "multi" ? "Multiple pieces"
            : "Options & availability"
            : current}
        </h2>

        <div className="mt-3">
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
            <span className={`h-9 w-9 rounded-full grid place-items-center text-[11px] leading-[16px] font-semibold ${
              active ? "bg-[var(--primary)] text-white" :
              done ? "bg-[var(--primary)] text-white" :
              "bg-white border border-[var(--border)] text-[var(--muted-foreground)]"
            }`}>
              {done ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <span className={`text-[14px] leading-[20px] tracking-[0.1px] ${active ? "font-semibold text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>
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
  return <div className="text-[14px] leading-[20px] tracking-[0.1px] font-medium text-[var(--foreground)]">{children}</div>;
}
function Field({ label, hint, children }: { label: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2">{children}</div>
      {hint && <p className="mt-1.5 text-[12px] leading-[16px] tracking-[0.4px] text-[var(--muted-foreground)]">{hint}</p>}
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
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {[0, 1, 2, 3, 4].map((i) => {
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
              <div className="flex items-center gap-1.5 text-[var(--success)] font-semibold text-[14px] leading-[20px] tracking-[0.1px]"><CheckCircle2 className="h-4 w-4" /> Good</div>
              <ul className="mt-2 space-y-2 text-xs text-[var(--foreground)]/80">
                <li>• Natural lighting</li><li>• Simple background</li><li>• Full product visible</li>
              </ul>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/5 overflow-hidden">
            <img src={photoBad} alt="Bad product photo" className="aspect-square w-full object-cover" />
            <div className="p-3">
              <div className="flex items-center gap-1.5 text-[var(--destructive)] font-semibold text-[14px] leading-[20px] tracking-[0.1px]"><XCircle className="h-4 w-4" /> Avoid</div>
              <ul className="mt-2 space-y-2 text-xs text-[var(--foreground)]/80">
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
      <Field label="Where is it made?">
        <div className="grid grid-cols-2 gap-3">
          <select
            className="ih-i"
            value={f.originState}
            onChange={(e) => { update("originState", e.target.value); update("origin", `${f.originCity ? f.originCity + ", " : ""}${e.target.value}`); }}
          >
            <option value="">Select state</option>
            {["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <input
            className="ih-i"
            value={f.originCity}
            onChange={(e) => { update("originCity", e.target.value); update("origin", `${e.target.value ? e.target.value + ", " : ""}${f.originState}`); }}
            placeholder="City / District"
          />
        </div>
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
      <span className="font-medium text-[14px] leading-[20px]">{label}</span>
    </button>
  );
}
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`h-9 px-4 rounded-full border text-[14px] leading-[20px] tracking-[0.1px] font-medium transition ${
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
      <span className="font-medium text-[14px] leading-[20px]">{label}</span>
    </button>
  );
}

type VariantItem = { label: string; qty: string; swatchType: "color" | "image"; color: string; photo?: string };

function SwatchCell({ v, onChange }: { v: VariantItem; onChange: (patch: Partial<VariantItem>) => void }) {
  const type = v.swatchType ?? "color";
  const color = v.color ?? "#888888";
  return (
    <div className="flex flex-col items-center gap-1">
      {type === "color" ? (
        <label className="cursor-pointer relative group">
          <div className="h-9 w-9 rounded-full border-2 border-white shadow ring-1 ring-[var(--border)] overflow-hidden"
            style={{ background: color }} />
          <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white border border-[var(--border)] grid place-items-center shadow-sm pointer-events-none">
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1L9 3L3 9H1V7L7 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" className="text-[var(--muted-foreground)]"/>
            </svg>
          </div>
          <input type="color" value={color} onChange={(e) => onChange({ color: e.target.value })}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
        </label>
      ) : v.photo ?? false ? (
        <label className="cursor-pointer">
          <img src={v.photo} alt="" className="h-9 w-9 rounded-full object-cover border-2 border-white shadow ring-1 ring-[var(--border)]" />
          <input type="file" accept="image/*" hidden onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange({ photo: URL.createObjectURL(file) });
          }} />
        </label>
      ) : (
        <label className="cursor-pointer">
          <div className="h-9 w-9 rounded-full border-2 border-dashed border-[var(--border)] bg-[var(--cream)]/40 grid place-items-center text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition">
            <ImagePlus className="h-3.5 w-3.5" />
          </div>
          <input type="file" accept="image/*" hidden onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange({ photo: URL.createObjectURL(file) });
          }} />
        </label>
      )}
    </div>
  );
}

function VariantTags({ label, hint, values, onChange, suggestions, showSwatch = true }: {
  label: string; hint: string; suggestions?: string[]; showSwatch?: boolean;
  values: VariantItem[]; onChange: (v: VariantItem[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const labels = values.map((v) => v.label);

  const COLOR_MAP: Record<string, string> = {
    red: "#c0392b", crimson: "#dc143c", maroon: "#800000",
    blue: "#2980b9", navy: "#001f5b", "sky blue": "#87ceeb", cobalt: "#0047ab", teal: "#008080",
    green: "#27ae60", olive: "#808000", lime: "#32cd32", mint: "#98ff98", sage: "#8fbc8f",
    yellow: "#f1c40f", gold: "#ffd700", mustard: "#ffdb58",
    orange: "#e67e22", peach: "#ffcba4", coral: "#ff6b6b",
    pink: "#e91e8c", rose: "#ff007f", blush: "#de5d83", magenta: "#ff00ff",
    purple: "#8e44ad", violet: "#7f00ff", lavender: "#b57edc", indigo: "#4b0082",
    brown: "#795548", chocolate: "#7b3f00", tan: "#d2b48c", caramel: "#c68642",
    black: "#1a1a1a", charcoal: "#36454f", grey: "#9e9e9e", gray: "#9e9e9e", silver: "#c0c0c0",
    white: "#f5f5f5", cream: "#fffdd0", ivory: "#fffff0", beige: "#f5f0e8",
    natural: "#c8a87a", khaki: "#c3b091", sand: "#c2b280",
  };

  const colorFor = (name: string) => COLOR_MAP[name.toLowerCase().trim()] ?? "#888888";

  const addFromRef = () => {
    const trimmed = (inputRef.current?.value ?? "").trim();
    if (trimmed && !labels.includes(trimmed))
      onChange([...values, { label: trimmed, qty: "", swatchType: "color", color: colorFor(trimmed) }]);
    if (inputRef.current) inputRef.current.value = "";
  };
  const addDirect = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !labels.includes(trimmed))
      onChange([...values, { label: trimmed, qty: "", swatchType: "color", color: colorFor(trimmed) }]);
  };
  const patch = (lbl: string, p: Partial<VariantItem>) =>
    onChange(values.map((v) => v.label === lbl ? { ...v, ...p } : v));
  const remove = (lbl: string) => onChange(values.filter((v) => v.label !== lbl));
  const setQty = (lbl: string, qty: string) => patch(lbl, { qty: qty.replace(/[^\d]/g, "") });

  return (
    <div>
      <div className="text-[14px] leading-[20px] tracking-[0.1px] font-medium text-[var(--foreground)]">{label}</div>
      <p className="text-[12px] leading-[16px] tracking-[0.4px] text-[var(--muted-foreground)] mt-0.5">{hint}</p>
      {values.length > 0 && (
        <div className="mt-3 rounded-xl border border-[var(--border)] overflow-hidden">
          <div className={`grid ${showSwatch ? "grid-cols-[44px_48px_1fr_100px_32px]" : "grid-cols-[1fr_100px_32px]"} text-[11px] font-medium text-[var(--muted-foreground)] uppercase tracking-[0.4px] px-3 py-2 bg-[var(--cream)]/60 border-b border-[var(--border)] gap-2`}>
            {showSwatch && <><span>Swatch</span><span>Photo</span></>}
            <span>Option</span><span>Pieces</span><span />
          </div>
          {values.map((v) => (
            <div key={v.label} className={`grid ${showSwatch ? "grid-cols-[44px_48px_1fr_100px_32px]" : "grid-cols-[1fr_100px_32px]"} items-center px-3 py-2.5 border-b border-[var(--border)] last:border-0 gap-2`}>
              {showSwatch && (
                <>
                  <SwatchCell v={v} onChange={(p) => patch(v.label, p)} />
                  <label className="cursor-pointer">
                    {v.photo ? (
                      <img src={v.photo} alt="" className="h-10 w-10 rounded-lg object-cover border border-[var(--border)]" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-10 w-10 rounded-lg border-2 border-dashed border-[var(--primary)]/40 bg-[var(--primary)]/5 text-[var(--primary)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition gap-0.5">
                        <ImagePlus className="h-3.5 w-3.5" />
                        <span className="text-[9px] font-medium leading-none">Add</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" hidden onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) patch(v.label, { photo: URL.createObjectURL(file) });
                    }} />
                  </label>
                </>
              )}
              <span className="text-[14px] leading-[20px] font-medium">{v.label}</span>
              <input
                className="w-full rounded-lg border border-[var(--border)] px-2 py-1 text-[14px] leading-[20px] outline-none focus:border-[var(--primary)]"
                inputMode="numeric" placeholder="0" value={v.qty}
                onChange={(e) => setQty(v.label, e.target.value)} />
              <button type="button" onClick={() => remove(v.label)} className="text-[var(--muted-foreground)] hover:text-[var(--destructive)] text-lg leading-none justify-self-center">×</button>
            </div>
          ))}
        </div>
      )}
      {suggestions ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => addDirect(s)}
              className={`h-8 px-3 rounded-full border text-[12px] font-medium transition ${labels.includes(s) ? "border-[var(--primary)] bg-[var(--primary)] text-white" : "border-[var(--border)] bg-white hover:bg-[var(--cream)] text-[var(--foreground)]"}`}>
              {labels.includes(s) ? "✓ " : "+ "}{s}
            </button>
          ))}
          <div className="flex gap-1.5">
            <input ref={inputRef}
              className="h-8 px-3 rounded-full border border-dashed border-[var(--border)] text-[12px] w-32 outline-none focus:border-[var(--primary)] bg-white"
              placeholder="Other…" />
            <button type="button" onClick={addFromRef}
              className="h-8 px-3 rounded-full border border-[var(--primary)] bg-[var(--primary)] text-white text-[12px] font-medium">
              Add
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex gap-2 items-center">
          <input ref={inputRef}
            className="h-9 px-3 rounded-lg border border-[var(--border)] focus:border-[var(--primary)] text-[14px] leading-[20px] outline-none bg-white w-44"
            placeholder="e.g. Red" />
          <button type="button" onClick={addFromRef}
            className="h-9 px-4 rounded-lg bg-[var(--primary)] text-white text-[14px] font-medium">
            Add
          </button>
        </div>
      )}
    </div>
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
        <div className="mt-3 font-medium text-[14px] leading-[20px]">Pick a product kind first</div>
        <div className="text-sm text-[var(--muted-foreground)] mt-1">Go back to Basic Info and tell us what type of product this is.</div>
      </div>
    );
  }

  if (f.kind === "multi") {
    return (
      <div className="space-y-6 max-w-2xl">
        <p className="text-sm text-[var(--muted-foreground)] -mt-2">Tell us about quantities and variations</p>
        <div>
          <Label>Does this product come in different options? <span className="font-normal text-[var(--muted-foreground)]">(size, colour, etc.)</span></Label>
          <div className="mt-2 space-y-2 max-w-md">
            <RadioCard label="Yes" checked={f.hasOptions === "yes"} onChange={() => update("hasOptions", "yes")} />
            <RadioCard label="No" checked={f.hasOptions === "no"} onChange={() => update("hasOptions", "no")} />
          </div>
        </div>
        {f.hasOptions === "no" && (
          <Field label="How many pieces do you have?">
            <input className="ih-i" inputMode="numeric" value={f.qty} onChange={(e) => update("qty", e.target.value.replace(/[^\d]/g, ""))} placeholder="5" />
          </Field>
        )}
        {f.hasOptions === "yes" && (
          <div className="space-y-5">
            <div>
              <Label>What changes between them?</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Size", "Colour", "Both", "Something else"].map((c) => (
                  <Chip key={c} label={c} active={f.changes === c} onClick={() => update("changes", c)} />
                ))}
              </div>
            </div>
            {(f.changes === "Size" || f.changes === "Both") && (
              <VariantTags
                label="Sizes available"
                hint="e.g. S, M, L, XL or 30, 32, 34"
                suggestions={["XS", "S", "M", "L", "XL", "XXL", "Free size"]}
                showSwatch={false}
                values={f.sizes}
                onChange={(v) => update("sizes", v)}
              />
            )}
            {(f.changes === "Colour" || f.changes === "Both") && (
              <VariantTags
                label="Colours available"
                hint=""
                values={f.colours}
                onChange={(v) => update("colours", v)}
              />
            )}
            {f.changes === "Something else" && (
              <Field label="What changes?" hint="Describe what's different between options">
                <input className="ih-i" value={f.changesOther} onChange={(e) => update("changesOther", e.target.value)} placeholder="e.g. fabric, finish, pattern" />
              </Field>
            )}
          </div>
        )}
      </div>
    );
  }

  const isMTO = f.kind === "mto";

  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-sm text-[var(--muted-foreground)] -mt-2">
        {isMTO ? "Made only after an order is placed, with optional buyer customisation." : "Help buyers understand how you fulfil orders"}
      </p>

      {!isMTO && (
        <div>
          <Label>Do you make this product after you receive an order?</Label>
          <div className="mt-2 space-y-2 max-w-md">
            <RadioCard label="Yes — I make it fresh after each order" checked={f.madeToOrder === "yes"} onChange={() => update("madeToOrder", "yes")} />
            <RadioCard label="No — I have pieces ready to ship" checked={f.madeToOrder === "no"} onChange={() => update("madeToOrder", "no")} />
          </div>
        </div>
      )}

      {(isMTO || f.madeToOrder === "yes") && (
        <Field label="How long does it take to make?">
          <select className="ih-i" value={f.mtoTime} onChange={(e) => update("mtoTime", e.target.value)}>
            <option value="" disabled>Select time</option>
            {["1–2 days", "3–5 days", "1 week", "2 weeks", "1 month", "More than 1 month"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
      )}

      {(isMTO || f.madeToOrder !== null) && (
        <div>
          <Label>Can customers ask for a different size, colour, or design?</Label>
          <div className="mt-2 space-y-2 max-w-md">
            <RadioCard label="Yes" checked={f.canRequest === "yes"} onChange={() => update("canRequest", "yes")} />
            <RadioCard label="No" checked={f.canRequest === "no"} onChange={() => update("canRequest", "no")} />
          </div>
        </div>
      )}

      {f.canRequest === "yes" && (
        <div>
          <Label>What can they change?</Label>
          <p className="text-[12px] leading-[16px] tracking-[0.4px] text-[var(--muted-foreground)] mt-0.5">Select all that apply and add any constraints</p>
          <div className="mt-3 space-y-2 max-w-md">
            {[
              { key: "Size", placeholder: "e.g. Small, Medium, Large or 10×12 inches" },
              { key: "Colour", placeholder: "e.g. Any colour, or specify: Red, Indigo, Natural" },
              { key: "Material", placeholder: "e.g. Cotton or silk only" },
              { key: "Pattern / Design", placeholder: "e.g. Customer can share a reference image" },
              { key: "Other", placeholder: "Describe what else can be changed" },
            ].map(({ key, placeholder }) => {
              const checked = f.customisable.includes(key);
              return (
                <div key={key} className={`rounded-2xl border transition ${checked ? "border-[var(--primary)] bg-[var(--cream)]" : "border-[var(--border)] bg-white"}`}>
                  <button type="button"
                    className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    onClick={() => toggle(key)}>
                    <span className={`h-5 w-5 rounded-md border-2 grid place-items-center shrink-0 transition ${checked ? "border-[var(--primary)] bg-[var(--primary)]" : "border-[var(--border)]"}`}>
                      {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </span>
                    <span className="font-medium text-[14px] leading-[20px]">{key}</span>
                  </button>
                  {checked && (
                    <div className="px-4 pb-3">
                      <input
                        className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-[14px] leading-[20px] outline-none focus:border-[var(--primary)] bg-white"
                        placeholder={placeholder}
                        value={(f.constraints ?? {})[key] ?? ""}
                        onChange={(e) => update("constraints", { ...(f.constraints ?? {}), [key]: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const GST_RATES = ["0", "5", "12", "18", "28"];

function Pricing({ f, update }: { f: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const num = Number(f.price) || 0;
  const rate = Number(f.gstRate) || 0;
  const gst = Math.round(num * rate / (100 + rate));
  const customer = num;
  const youGet = num - gst - Math.round(num * 0.08);
  return (
    <div className="space-y-5 max-w-2xl">
      <Field label="Selling price (₹)" hint="Price before tax">
        <input className="ih-i" inputMode="numeric" value={f.price} onChange={(e) => update("price", e.target.value.replace(/[^\d]/g, ""))} placeholder="0" />
      </Field>
      <Field label="HSN Code" hint={<>Determines your GST rate. <a href="https://www.cbic-gst.gov.in/gst-goods-services-rates.html" target="_blank" rel="noreferrer" className="text-[var(--primary)] underline underline-offset-2 hover:opacity-70">Find your HSN code →</a></>}>
        <input className="ih-i" value={f.hsn} onChange={(e) => update("hsn", e.target.value)} placeholder="6 or 8 digit code" />
      </Field>
      <Field label="GST rate">
        <select className="ih-i" value={f.gstRate} onChange={(e) => update("gstRate", e.target.value)}>
          {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
        </select>
      </Field>
      <div className="p-4 rounded-2xl bg-[var(--cream)] border border-[var(--primary)]/10">
        <div className="text-[14px] leading-[20px] font-medium text-[var(--primary)]">What you'll receive</div>
        <Row label="Customer price" value={`₹${customer.toLocaleString("en-IN")}`} />
        <Row label={<span className="inline-flex items-center gap-1">GST ({rate}%) <Info className="h-3 w-3" /></span>} value={`₹${gst.toLocaleString("en-IN")}`} />
        <div className="border-t border-[var(--primary)]/15 mt-2 pt-2">
          <Row label={<span className="font-semibold text-[var(--foreground)]">You will receive</span>}
               value={<span className="font-bold text-[var(--primary)] text-lg">₹{youGet.toLocaleString("en-IN")}</span>} />
        </div>
      </div>
    </div>
  );
}
function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-[14px] leading-[20px]">
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
        {f.images.length > 0 ? (
          <div className="grid grid-cols-4 gap-0.5 bg-[var(--border)]">
            {f.images.slice(0, 4).map((src, i) => (
              <div key={i} className={`bg-[var(--cream)] overflow-hidden ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
            {f.images.length < 4 && Array.from({ length: 4 - f.images.length }).map((_, i) => (
              <div key={`e${i}`} className="aspect-square bg-[var(--cream)]" />
            ))}
          </div>
        ) : (
          <div className="aspect-[4/3] bg-[var(--cream)] grid place-items-center text-[var(--primary)]">
            <ImagePlus className="h-8 w-8" />
          </div>
        )}
        <div className="p-4">
          <div className="text-xs text-[var(--muted-foreground)] inline-flex items-center gap-1.5">
            <Package2 className="h-3 w-3" /> {f.category || "—"}{f.craft ? ` · ${f.craft}` : ""}
          </div>
          <div className="mt-1 text-[20px] leading-[24px] font-medium">{f.name || "Product Name"}</div>
          <div className="mt-1 text-[var(--primary)] font-semibold">₹{price.toLocaleString("en-IN")}</div>
        </div>
      </div>
      <ReviewSection title="Basic details" onEdit={() => onEdit(idx("Basic Info"))} items={[
        ["Category", f.category || "—"], ["Subcategory", f.subcategory || "—"], ["Craft", f.craft || "—"],
        ["Kind", f.kind ? (KINDS.find((k) => k.id === f.kind)?.title ?? "—") : "—"],
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
        <div className="font-medium text-[14px] leading-[20px]">{title}</div>
        <button onClick={onEdit} className="text-xs text-[var(--primary)] font-medium">Edit</button>
      </div>
      <div className="space-y-1">
        {items.map(([k, v]) => (
          <div key={k} className="flex justify-between text-[14px] leading-[20px] tracking-[0.1px]">
            <span className="text-[var(--muted-foreground)]">{k}</span>
            <span className="text-[var(--foreground)]">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CongratsModal({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 backdrop-blur-sm px-6 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-[var(--primary)] text-white grid place-items-center">
          <Sparkles className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-center text-[22px] font-bold tracking-tight">Congratulations</h2>
        <p className="mt-2 text-center text-sm text-[var(--muted-foreground)]">
          You've added your first product. Your shop is now live on India Handmade.
        </p>
        <div className="mt-6">
          <button type="button" onClick={onContinue} className="ih-btn ih-btn-primary ih-btn-full">Continue to your shop</button>
        </div>
      </div>
    </div>
  );
}
