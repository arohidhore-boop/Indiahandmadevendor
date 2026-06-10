import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  AlertCircle,
  
  ShieldCheck,
  Pencil,
  Lock,
  Loader2,
  Building2,
  MapPin,
  Landmark,
  Store,
} from "lucide-react";
import { AppShell } from "@/components/ih/AppShell";
import {
  ihStore,
  useIH,
  type OnboardingData,
  type GstChoice,
  type ArtisanBody,
  type BankStatus,
} from "@/lib/ih-store";

const STEP_LABELS = [
  "GST or registration",
  "Shop profile",
  "Address",
  "Bank account",
  "Review and complete",
];

type Search = { step?: number };

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Complete your profile — India Handmade" }] }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    step: s.step ? Math.min(5, Math.max(1, Number(s.step))) : 1,
  }),
  component: Onboarding,
});

function Onboarding() {
  const { step = 1 } = useSearch({ from: "/onboarding" });
  const nav = useNavigate();
  const ih = useIH();
  const [data, setData] = useState<OnboardingData>(ih.onboarding.data);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => setData(ih.onboarding.data), [ih.onboarding.data]);

  const set = <K extends keyof OnboardingData>(k: K, v: OnboardingData[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k as string]: "" }));
  };

  const goStep = (n: number) => nav({ to: "/onboarding", search: { step: n } });

  const persist = (patch?: Partial<OnboardingData>) => {
    const next = { ...data, ...patch };
    if (patch) setData(next);
    ihStore.updateOnboarding(next);
  };

  const completeStep = (n: number) => ihStore.setOnboardingStatus(n, "completed");

  const onContinue = () => {
    const errs = validateStep(step, data);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      ihStore.updateOnboarding(data);
      ihStore.setOnboardingStatus(step, "needs_attention");
      return;
    }
    ihStore.updateOnboarding(data);
    completeStep(step);
    if (step === 2) {
      ihStore.setSeller({
        shopName: data.publicShopName,
        name: data.contactName ?? ih.seller?.name ?? "",
        primaryCraft: data.craftType,
      });
    }
    if (step === 1) {
      ihStore.setSeller({ gst: data.gstNumber, eid: data.eidNumber });
    }
    goStep(step + 1);
  };

  if (step === 5) return <ReviewScreen data={data} goStep={goStep} />;

  return (
    <AppShell>
      <Header step={step} />
      <Stepper current={step} statuses={ih.onboarding.statuses} onJump={goStep} />

      <div className="surface-card p-6 sm:p-8 animate-fade-up">
        {step === 1 && <Step1Gst data={data} set={set} errors={errors} persist={persist} />}
        {step === 2 && <Step2Shop data={data} set={set} errors={errors} />}
        {step === 3 && <Step3Address data={data} set={set} errors={errors} />}
        {step === 4 && <Step4Bank data={data} set={set} errors={errors} />}

        <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-wrap items-center gap-3">
          <button
            onClick={() => goStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="ih-btn ih-btn-ghost text-[var(--muted-foreground)] disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex-1" />
          <Link to="/post" className="ih-btn ih-btn-ghost text-[var(--muted-foreground)]">
            Save for later
          </Link>
          <button onClick={onContinue} className="ih-btn ih-btn-primary">
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function Header({ step }: { step: number }) {
  return (
    <div>
      <Link to="/post" className="text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)] inline-flex items-center gap-1">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
      </Link>
      <h1 className="font-serif text-[26px] sm:text-3xl mt-2 leading-tight">
        {STEP_LABELS[step - 1]}
      </h1>
      <p className="text-sm text-[var(--muted-foreground)] mt-1">
        Step {step} of 5
      </p>
    </div>
  );
}

/* ---------- Stepper ---------- */

function Stepper({
  current,
  statuses,
  onJump,
}: {
  current: number;
  statuses: Record<number, string>;
  onJump: (n: number) => void;
}) {
  const completedCount = STEP_LABELS.filter((_, i) => statuses[i + 1] === "completed").length;
  const pct = Math.round((completedCount / STEP_LABELS.length) * 100);
  return (
    <div className="surface-card p-5">
      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] mb-2">
        <span>{completedCount} of {STEP_LABELS.length} steps complete</span>
        <span className="font-medium text-[var(--foreground)]">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--cream)] overflow-hidden">
        <div className="h-full bg-[var(--primary)] transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ol className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-2">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const status = statuses[n];
          const active = n === current;
          const done = status === "completed";
          const attn = status === "needs_attention";
          return (
            <li key={label}>
              <button
                onClick={() => onJump(n)}
                className={`w-full text-left rounded-xl p-3 border transition ${
                  active
                    ? "border-[var(--primary)] bg-[var(--primary)]/5"
                    : done
                    ? "border-[var(--success)]/30 bg-[var(--success)]/5"
                    : attn
                    ? "border-[var(--destructive)]/40 bg-[var(--destructive)]/5"
                    : "border-[var(--border)] bg-white hover:border-[var(--primary)]/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-6 w-6 rounded-full grid place-items-center text-[11px] font-semibold ${
                      done
                        ? "bg-[var(--success)] text-white"
                        : attn
                        ? "bg-[var(--destructive)] text-white"
                        : active
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--cream)] text-[var(--muted-foreground)]"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : n}
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-[var(--muted-foreground)]">
                    Step {n}
                  </span>
                </div>
                <div className="mt-1.5 text-xs font-medium leading-snug">{label}</div>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- Primitives ---------- */

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1">
        {label}
        {required && <span className="text-[var(--accent)]">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && !error && <p className="text-xs text-[var(--muted-foreground)] mt-1.5">{hint}</p>}
      {error && (
        <p className="text-xs text-[var(--destructive)] mt-1.5 flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      )}
    </label>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-[10px] border border-[var(--border)] bg-white text-sm outline-none focus:border-[var(--primary)] transition disabled:bg-[var(--cream)]/40 disabled:text-[var(--muted-foreground)]";

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}
function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return <select {...props} className={`${inputCls} ${props.className ?? ""}`}>{props.children}</select>;
}
function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} resize-none ${props.className ?? ""}`} />;
}

function FileDrop({
  value,
  onChange,
  label = "Drop file here, or",
}: {
  value?: string;
  onChange: (name: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onChange(f.name);
      }}
      className={`rounded-[10px] border-2 border-dashed p-4 text-center text-sm transition ${
        drag ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)] bg-[var(--cream)]/30"
      }`}
    >
      <Upload className="h-5 w-5 mx-auto text-[var(--muted-foreground)]" />
      {value ? (
        <div className="mt-2">
          <div className="font-medium text-[var(--foreground)]">{value}</div>
          <button type="button" className="text-xs text-[var(--primary)] underline mt-1" onClick={() => onChange("")}>
            Remove
          </button>
        </div>
      ) : (
        <div className="mt-2 text-[var(--muted-foreground)]">
          {label}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onChange(f.name);
        }}
      />
    </div>
  );
}

function OptionRow({
  active,
  onClick,
  label,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  desc?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-[10px] border-2 text-sm transition flex items-start gap-3 ${
        active
          ? "border-[var(--primary)] bg-[var(--primary)]/5"
          : "border-[var(--border)] bg-white hover:border-[var(--primary)]/40"
      }`}
    >
      <span
        className={`mt-0.5 h-4 w-4 rounded-full border-2 grid place-items-center shrink-0 ${
          active ? "border-[var(--primary)]" : "border-[var(--border)]"
        }`}
      >
        {active && <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />}
      </span>
      <span className="flex-1">
        <span className="font-medium">{label}</span>
        {desc && <span className="block text-xs text-[var(--muted-foreground)] mt-0.5">{desc}</span>}
      </span>
    </button>
  );
}

/* ---------- Step 1 — GST / registration ---------- */

type StepProps = {
  data: OnboardingData;
  set: <K extends keyof OnboardingData>(k: K, v: OnboardingData[K]) => void;
  errors: Record<string, string>;
};

function Step1Gst({
  data,
  set,
  errors,
  persist,
}: StepProps & { persist: (patch?: Partial<OnboardingData>) => void }) {
  const [fetching, setFetching] = useState(false);
  const choice = data.gstChoice;

  const fetchDetails = () => {
    setFetching(true);
    setTimeout(() => {
      const patch: Partial<OnboardingData> = {
        fetched: true,
        legalName: data.legalName ?? "Samba Sakhi Crafts Producer Company Limited",
        tradeName: data.tradeName ?? "Samba Sakhi Crafts",
        registeredAddress:
          data.registeredAddress ?? "12 Old City Road, Pink City, Jaipur",
        registrationStatus: "Active",
        fetchedState: data.fetchedState ?? "Rajasthan",
        fetchedPincode: data.fetchedPincode ?? "302002",
        pan: data.pan ?? "AAACS1234F",
        cin: data.cin ?? "U17299RJ2019PTC065432",
      };
      persist(patch);
      setFetching(false);
    }, 900);
  };




  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl">Add GST or registration details</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Do you have a GST number?
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <OptionRow
          active={choice === "yes_gst"}
          onClick={() => set("gstChoice", "yes_gst")}
          label="Yes"
          desc="I have a GST number"
        />
        <OptionRow
          active={choice === "eid"}
          onClick={() => set("gstChoice", "eid")}
          label="No"
          desc="I don't have GST yet"
        />
      </div>
      {errors.gstChoice && (
        <p className="text-xs text-[var(--destructive)] flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" /> {errors.gstChoice}
        </p>
      )}

      {choice === "yes_gst" && (
        <div className="space-y-4 animate-fade-up">
          <Field label="GST number" required error={errors.gstNumber}>
            <TextInput
              value={data.gstNumber ?? ""}
              onChange={(e) => set("gstNumber", e.target.value.toUpperCase())}
              placeholder="22AAAAA0000A1Z5"
              maxLength={15}
              className="tracking-wider"
            />
          </Field>
          <button
            type="button"
            onClick={fetchDetails}
            disabled={!data.gstNumber || data.gstNumber.length < 5 || fetching}
            className="ih-btn ih-btn-outline"
          >
            {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {fetching ? "Fetching…" : data.fetched ? "Refetch details" : "Fetch details"}
          </button>
        </div>
      )}

      {choice === "eid" && (
        <div className="space-y-4 animate-fade-up">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1 min-w-[240px]">
              <Field
                label="Enter Enrolment ID / UIN"
                required
                error={errors.eidNumber}
              >
                <TextInput
                  value={data.eidNumber ?? ""}
                  onChange={(e) => set("eidNumber", e.target.value.toUpperCase())}
                  placeholder="292600069119ESX"
                  className="tracking-wider"
                />
              </Field>
            </div>
            {data.fetched ? (
              <div className="flex items-center gap-2 mt-7 text-[var(--success)] font-medium">
                <span className="h-5 w-5 rounded-full bg-[var(--success)] text-white inline-flex items-center justify-center">
                  <Check className="h-3 w-3" />
                </span>
                Verified
              </div>
            ) : (
              <button
                type="button"
                onClick={fetchDetails}
                disabled={!data.eidNumber || data.eidNumber.length < 5 || fetching}
                className="ih-btn ih-btn-outline mt-7"
              >
                {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {fetching ? "Verifying…" : "Verify"}
              </button>
            )}
          </div>

          {data.fetched && (
            <div className="animate-fade-up">
              <h3 className="font-semibold text-[var(--foreground)] mb-3">
                Below details are linked to your enrolment ID
              </h3>
              <div className="border-l-2 border-[var(--success)] pl-4 space-y-4">
                <div>
                  <div className="text-xs text-[var(--muted-foreground)]">Name</div>
                  <div className="font-medium mt-0.5">{data.legalName ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--muted-foreground)]">PAN Number</div>
                  <div className="font-medium mt-0.5">{data.pan ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--muted-foreground)]">Registered Business Address</div>
                  <div className="font-medium mt-0.5">{data.registeredAddress ?? "—"}</div>
                </div>
              </div>
            </div>
          )}

          {!data.fetched && (
            <a
              href="https://udyamregistration.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="ih-btn ih-btn-ghost text-[var(--primary)] px-0"
            >
              Don't have one? Get EID number <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
      )}

      {data.fetched && choice === "yes_gst" && (
        <ConfirmCard data={data} />
      )}

      <div className="rounded-xl bg-[var(--cream)]/60 border border-[var(--border)] p-3 flex gap-2">
        <ShieldCheck className="h-4 w-4 text-[var(--success)] shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--muted-foreground)]">
          Your tax details are encrypted and shared only with verified buyers and the Ministry of MSME.
        </p>
      </div>
    </div>
  );
}

function ConfirmCard({ data }: { data: OnboardingData }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-5 animate-fade-up">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1.5">
            <Lock className="h-3 w-3" /> Official details fetched
          </div>
          <h3 className="font-serif text-lg mt-1">Confirm your business details</h3>
        </div>
        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[var(--success)]/15 text-[var(--success)]">
          {data.registrationStatus ?? "Active"}
        </span>
      </div>

      <dl className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <ReadField label="Legal business name" value={data.legalName} />
        <div className="sm:col-span-2">
          <ReadField label="Registered address" value={data.registeredAddress} />
        </div>
        <ReadField label="State" value={data.fetchedState} />
        <ReadField label="PIN code" value={data.fetchedPincode} />
        <ReadField label="PAN (auto-fetched)" value={data.pan} />
        <ReadField label="CIN (auto-fetched)" value={data.cin} />
      </dl>

      <p className="text-xs text-[var(--muted-foreground)] mt-4">
        Official GST data is read-only. You can edit your shop name, addresses and contact person in later steps.
      </p>
    </div>
  );
}

function ReadField({
  label,
  value,
  editable,
  editValue,
  onChange,
}: {
  label: string;
  value?: string;
  editable?: boolean;
  editValue?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-[var(--muted-foreground)]">{label}</dt>
      {editable ? (
        <input
          value={editValue ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          className={inputCls + " mt-1"}
        />
      ) : (
        <dd className="font-medium mt-0.5">{value ?? "—"}</dd>
      )}
    </div>
  );
}

/* ---------- Step 2 — Shop profile ---------- */

function Step2Shop({ data, set, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl">Tell us about your shop</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          These details appear on your India Handmade storefront.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <Field
            label="Public shop name"
            required
            hint="This is the name buyers will see on India Handmade."
            error={errors.publicShopName}
          >
            <TextInput
              value={data.publicShopName ?? ""}
              onChange={(e) => set("publicShopName", e.target.value)}
              placeholder="e.g. Samba Sakhi Crafts"
            />
          </Field>
        </div>


        <Field label="Contact person name" required error={errors.contactName}>
          <TextInput
            value={data.contactName ?? ""}
            onChange={(e) => set("contactName", e.target.value)}
            placeholder="Full name"
          />
        </Field>

        <Field label="Mobile number" required error={errors.mobile}>
          <TextInput
            inputMode="numeric"
            maxLength={10}
            value={data.mobile ?? ""}
            onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))}
            placeholder="10-digit mobile"
          />
        </Field>

        <Field label="Craft type" required error={errors.craftType}>
          <Select value={data.craftType ?? ""} onChange={(e) => set("craftType", e.target.value)}>
            <option value="">Select…</option>
            {["Handicraft", "Handloom", "Both"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </Field>

      </div>

    </div>
  );
}

/* ---------- Step 3 — Address ---------- */

const STATES = [
  "Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra",
  "Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","West Bengal",
];

function Step3Address({ data, set, errors }: StepProps) {
  const hasGstAddress = !!data.registeredAddress;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl">Confirm your address</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          We use these to send official communication and pick up your parcels.
        </p>
      </div>

      {hasGstAddress && (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <div className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1.5">
            <Lock className="h-3 w-3" /> Registered address from GST
          </div>
          <p className="text-sm mt-2 font-medium">{data.registeredAddress}</p>
          <p className="text-sm mt-1 font-medium">
            {data.fetchedState} · {data.fetchedPincode}
          </p>

          <div className="mt-4 text-sm font-medium">Can we use this as your communication address?</div>
          <div className="grid sm:grid-cols-2 gap-3 mt-2">
            <OptionRow
              active={data.useGstAddress === true}
              onClick={() => {
                set("useGstAddress", true);
                set("commLine1", data.registeredAddress);
                set("commState", data.fetchedState);
                set("commPincode", data.fetchedPincode);
              }}
              label="Yes, use this address"
            />
            <OptionRow
              active={data.useGstAddress === false}
              onClick={() => set("useGstAddress", false)}
              label="No, add a different communication address"
            />
          </div>
        </div>
      )}

      {(data.useGstAddress === false || !hasGstAddress) && (
        <AddressFields
          prefix="comm"
          title="Communication address"
          data={data}
          set={set}
          errors={errors}
          withMobile
        />
      )}

      <div className="rounded-2xl border border-[var(--border)] bg-white p-5 space-y-3">
        <div className="text-sm font-medium">Is your pickup address the same as your communication address?</div>
        <div className="grid sm:grid-cols-2 gap-3">
          <OptionRow
            active={data.pickupSameAsComm === true}
            onClick={() => set("pickupSameAsComm", true)}
            label="Yes, same address"
          />
          <OptionRow
            active={data.pickupSameAsComm === false}
            onClick={() => set("pickupSameAsComm", false)}
            label="No, add pickup address"
          />
        </div>
      </div>

      {data.pickupSameAsComm === false && (
        <AddressFields prefix="pickup" title="Pickup address" data={data} set={set} errors={errors} />
      )}

    </div>
  );
}

function AddressFields({
  prefix,
  title,
  data,
  set,
  errors,
  withMobile,
}: {
  prefix: "comm" | "pickup" | "return";
  title: string;
  data: OnboardingData;
  set: StepProps["set"];
  errors: Record<string, string>;
  withMobile?: boolean;
}) {
  const k = (s: string) => (prefix + s.charAt(0).toUpperCase() + s.slice(1)) as keyof OnboardingData;
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-5 space-y-4 animate-fade-up">
      <h3 className="font-serif text-lg">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <Field label="Address line 1" required error={errors[k("line1") as string]}>
            <TextInput
              value={(data[k("line1")] as string) ?? ""}
              onChange={(e) => set(k("line1"), e.target.value as never)}
              placeholder="House / building / street"
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Address line 2">
            <TextInput
              value={(data[k("line2")] as string) ?? ""}
              onChange={(e) => set(k("line2"), e.target.value as never)}
              placeholder="Locality / landmark"
            />
          </Field>
        </div>
        <Field label="State" required error={errors[k("state") as string]}>
          <Select
            value={(data[k("state")] as string) ?? ""}
            onChange={(e) => set(k("state"), e.target.value as never)}
          >
            <option value="">Select state…</option>
            {STATES.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="City" required error={errors[k("city") as string]}>
          <TextInput
            value={(data[k("city")] as string) ?? ""}
            onChange={(e) => set(k("city"), e.target.value as never)}
            placeholder="City or town"
          />
        </Field>
        <Field label="PIN code" required error={errors[k("pincode") as string]}>
          <TextInput
            inputMode="numeric"
            maxLength={6}
            value={(data[k("pincode")] as string) ?? ""}
            onChange={(e) => set(k("pincode"), e.target.value.replace(/\D/g, "") as never)}
            placeholder="6-digit PIN"
          />
        </Field>
        {withMobile && (
          <Field label="Mobile number" required error={errors.commMobile}>
            <TextInput
              inputMode="numeric"
              maxLength={10}
              value={data.commMobile ?? ""}
              onChange={(e) => set("commMobile", e.target.value.replace(/\D/g, ""))}
              placeholder="10-digit mobile"
            />
          </Field>
        )}
      </div>
    </div>
  );
}

/* ---------- Step 4 — Bank ---------- */

function Step4Bank({ data, set, errors }: StepProps) {
  // Auto-fill bank name / branch from IFSC prefix (mock)
  useEffect(() => {
    const ifsc = data.ifsc ?? "";
    if (ifsc.length === 11) {
      const map: Record<string, { bank: string; branch: string }> = {
        SBIN: { bank: "State Bank of India", branch: "Main Branch" },
        HDFC: { bank: "HDFC Bank", branch: "City Branch" },
        ICIC: { bank: "ICICI Bank", branch: "Main Branch" },
        UTIB: { bank: "Axis Bank", branch: "Main Branch" },
        PUNB: { bank: "Punjab National Bank", branch: "Main Branch" },
      };
      const hit = map[ifsc.slice(0, 4)];
      if (hit) {
        if (!data.bankName) set("bankName", hit.bank);
        if (!data.branch) set("branch", hit.branch);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.ifsc]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl">Add bank account for payouts</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Payments from India Handmade will be sent to this account. If you change it later, the new account may need verification.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Bank account holder name" required error={errors.accountHolder}>
          <TextInput
            value={data.accountHolder ?? ""}
            onChange={(e) => set("accountHolder", e.target.value)}
            placeholder="As per bank records"
          />
        </Field>
        <Field label="IFSC code" required hint="Bank and branch will auto-fill" error={errors.ifsc}>
          <TextInput
            value={data.ifsc ?? ""}
            onChange={(e) => set("ifsc", e.target.value.toUpperCase())}
            placeholder="SBIN0001234"
            maxLength={11}
          />
        </Field>
        <Field label="Account number" required error={errors.accountNumber}>
          <TextInput
            inputMode="numeric"
            maxLength={18}
            value={data.accountNumber ?? ""}
            onChange={(e) => set("accountNumber", e.target.value.replace(/\D/g, ""))}
          />
        </Field>
        <Field label="Confirm account number" required error={errors.confirmAccountNumber}>
          <TextInput
            inputMode="numeric"
            maxLength={18}
            value={data.confirmAccountNumber ?? ""}
            onChange={(e) => set("confirmAccountNumber", e.target.value.replace(/\D/g, ""))}
          />
        </Field>
        <Field label="Bank name">
          <TextInput value={data.bankName ?? ""} disabled placeholder="Auto-filled from IFSC" />
        </Field>
        <Field label="Branch">
          <TextInput value={data.branch ?? ""} disabled placeholder="Auto-filled from IFSC" />
        </Field>
      </div>

      <Field
        label="Upload bank proof"
      >
        <FileDrop
          value={data.bankProofDoc}
          onChange={(name) => set("bankProofDoc", name)}
          label="Front page of passbook or a cancelled cheque (JPG, PNG or PDF) Max File size 1MB"
        />
      </Field>
    </div>
  );
}

function BankStatusBadge({ status }: { status: BankStatus }) {
  const map: Record<BankStatus, { label: string; cls: string }> = {
    not_added: { label: "Not added", cls: "bg-[var(--cream)] text-[var(--muted-foreground)]" },
    pending: { label: "Verification pending", cls: "bg-[var(--info)]/15 text-[var(--info)]" },
    verified: { label: "Verified", cls: "bg-[var(--success)]/15 text-[var(--success)]" },
    needs_correction: { label: "Needs correction", cls: "bg-[var(--destructive)]/15 text-[var(--destructive)]" },
  };
  const { label, cls } = map[status];
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-[var(--muted-foreground)]">Bank verification:</span>
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${cls}`}>{label}</span>
    </div>
  );
}

/* ---------- Step 5 — Review ---------- */

function ReviewScreen({ data, goStep }: { data: OnboardingData; goStep: (n: number) => void }) {
  const nav = useNavigate();
  

  const maskedAccount = useMemo(() => {
    const a = data.accountNumber ?? "";
    if (!a) return "—";
    return "•••• " + a.slice(-4);
  }, [data.accountNumber]);

  const complete = () => {
    ihStore.setOnboardingStatus(5, "completed");
    ihStore.updateOnboarding({ ...data, bankStatus: data.bankStatus ?? "pending" });
    nav({ to: "/post" });
  };


  const gstSummary =
    data.gstChoice === "yes_gst"
      ? `GST: ${data.gstNumber ?? "—"}`
      : data.gstChoice === "eid"
      ? `EID: ${data.eidNumber ?? "—"}`
      : data.gstChoice === "no_gst"
      ? "No GST"
      : "Skipped";

  const fmtAddr = (
    line1?: string, line2?: string, city?: string, state?: string, pin?: string
  ) => [line1, line2, city, state, pin].filter(Boolean).join(", ") || "—";

  return (
    <AppShell>
      <Header step={5} />
      <Stepper current={5} statuses={useIH().onboarding.statuses} onJump={goStep} />

      <div className="surface-card p-6 sm:p-8 animate-fade-up space-y-5">
        <ReviewSection
          icon={Landmark}
          title="GST / registration"
          onEdit={() => goStep(1)}
          rows={[
            ["Status", gstSummary],
            ["Legal business name", data.legalName ?? "—"],
          ]}
        />
        <ReviewSection
          icon={Store}
          title="Shop profile"
          onEdit={() => goStep(2)}
          rows={[
            ["Public shop name", data.publicShopName ?? "—"],
            ["Contact person", data.contactName ?? "—"],
            ["Mobile number", data.mobile ?? "—"],
            ["Craft type", data.craftType ?? "—"],
          ]}
        />
        <ReviewSection
          icon={MapPin}
          title="Address"
          onEdit={() => goStep(3)}
          rows={[
            ["Communication address", fmtAddr(data.commLine1, data.commLine2, data.commCity, data.commState, data.commPincode)],
            ["Pickup address", data.pickupSameAsComm
              ? "Same as communication address"
              : fmtAddr(data.pickupLine1, data.pickupLine2, data.pickupCity, data.pickupState, data.pickupPincode)],
          ]}
        />
        <ReviewSection
          icon={Building2}
          title="Payment"
          onEdit={() => goStep(4)}
          rows={[
            ["Account holder name", data.accountHolder ?? "—"],
            ["Bank account", maskedAccount],
            ["IFSC", data.ifsc ?? "—"],
            ["Bank", data.bankName ?? "—"],
          ]}
          extra={<BankStatusBadge status={data.bankStatus ?? "pending"} />}
        />

        <div className="pt-4 border-t border-[var(--border)] flex flex-wrap items-center gap-3">
          <button
            onClick={() => goStep(4)}
            className="ih-btn ih-btn-ghost text-[var(--muted-foreground)]"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex-1" />
          <button onClick={complete} className="ih-btn ih-btn-primary">
            Complete profile <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}


function ReviewSection({
  icon: Icon,
  title,
  rows,
  onEdit,
  extra,
}: {
  icon: typeof Check;
  title: string;
  rows: [string, string][];
  onEdit: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="h-9 w-9 rounded-full bg-[var(--cream)] grid place-items-center">
            <Icon className="h-4 w-4 text-[var(--primary)]" />
          </span>
          <h3 className="font-serif text-lg">{title}</h3>
        </div>
        <button onClick={onEdit} className="text-sm text-[var(--primary)] inline-flex items-center gap-1 hover:underline">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
      </div>
      <dl className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[11px] uppercase tracking-wider text-[var(--muted-foreground)]">{k}</dt>
            <dd className="font-medium mt-0.5 break-words">{v}</dd>
          </div>
        ))}
      </dl>
      {extra && <div className="mt-4">{extra}</div>}
    </section>
  );
}

/* ---------- Validation ---------- */

function validateStep(step: number, d: OnboardingData): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 1) {
    if (!d.gstChoice) e.gstChoice = "Please choose an option";
    if (d.gstChoice === "yes_gst" && (!d.gstNumber || d.gstNumber.length < 15)) e.gstNumber = "Enter a valid 15-character GSTIN";
    if (d.gstChoice === "eid" && !d.eidNumber) e.eidNumber = "Please enter your EID number";
  } else if (step === 2) {
    if (!d.publicShopName) e.publicShopName = "Please enter your shop name";
    if (!d.contactName) e.contactName = "Please enter contact person name";
    if (!d.mobile || d.mobile.length !== 10) e.mobile = "Enter a valid 10-digit mobile";
    if (!d.craftType) e.craftType = "Please choose your craft type";
  } else if (step === 3) {
    if (!d.useGstAddress) {
      if (!d.commLine1) e.commLine1 = "Required";
      if (!d.commState) e.commState = "Required";
      if (!d.commCity) e.commCity = "Required";
      if (!d.commPincode || d.commPincode.length !== 6) e.commPincode = "6-digit PIN";
      if (!d.commMobile || d.commMobile.length !== 10) e.commMobile = "10-digit mobile";
    }
    if (d.pickupSameAsComm === undefined) {
      e.pickupSameAsComm = "Please choose";
    } else if (d.pickupSameAsComm === false) {
      if (!d.pickupLine1) e.pickupLine1 = "Required";
      if (!d.pickupState) e.pickupState = "Required";
      if (!d.pickupCity) e.pickupCity = "Required";
      if (!d.pickupPincode || d.pickupPincode.length !== 6) e.pickupPincode = "6-digit PIN";
    }
  } else if (step === 4) {
    if (!d.accountHolder) e.accountHolder = "Required";
    if (!d.accountNumber) e.accountNumber = "Required";
    if (d.accountNumber !== d.confirmAccountNumber) e.confirmAccountNumber = "Account numbers do not match";
    if (!d.ifsc || d.ifsc.length !== 11) e.ifsc = "Enter a valid 11-character IFSC";
  }
  return e;
}
