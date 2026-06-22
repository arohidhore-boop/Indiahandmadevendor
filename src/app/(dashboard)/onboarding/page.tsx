"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
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
import {
  useStore,
  type OnboardingData,
  type BankStatus,
} from "@/lib/store";

const STEP_LABELS = [
  "GST or registration",
  "Shop profile",
  "Address",
  "Bank account",
  "Review and complete",
];

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <Onboarding />
    </Suspense>
  );
}

function Onboarding() {
  const searchParams = useSearchParams();
  const rawStep = Number(searchParams.get("step") ?? 1);
  const step = Math.min(5, Math.max(1, isNaN(rawStep) ? 1 : rawStep));
  const router = useRouter();
  const { onboarding, seller, setSeller, updateOnboarding, setOnboardingStatus } = useStore();
  const [data, setData] = useState<OnboardingData>(onboarding.data);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => setData(onboarding.data), [onboarding.data]);

  // Reset statuses when entering at step 1 so re-runs start clean
  useEffect(() => {
    if (step === 1) {
      [1, 2, 3, 4, 5].forEach((n) => setOnboardingStatus(n, "not_started"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = <K extends keyof OnboardingData>(k: K, v: OnboardingData[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k as string]: "" }));
  };

  const goStep = (n: number) => router.push(`/onboarding?step=${n}`);

  const persist = (patch?: Partial<OnboardingData>) => {
    const next = { ...data, ...patch };
    if (patch) setData(next);
    updateOnboarding(next);
  };

  const completeStep = (n: number) => setOnboardingStatus(n, "completed");

  const onContinue = () => {
    const errs = validateStep(step, data);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      updateOnboarding(data);
      setOnboardingStatus(step, "needs_attention");
      return;
    }
    updateOnboarding(data);
    completeStep(step);
    if (step === 2) {
      setSeller({
        shopName: data.publicShopName,
        name: data.contactName ?? seller?.name ?? "",
        primaryCraft: data.craftType,
      });
    }
    if (step === 1) {
      setSeller({ gst: data.gstNumber, eid: data.eidNumber });
    }
    goStep(step + 1);
  };

  if (step === 5) return <ReviewScreen data={data} goStep={goStep} />;

  return (
    <>
      <Header step={step} />
      <Stepper current={step} statuses={onboarding.statuses} onJump={goStep} />

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
          <Link href="/post" className="ih-btn ih-btn-ghost text-[var(--muted-foreground)]">
            Save for later
          </Link>
          <button onClick={onContinue} className="ih-btn ih-btn-primary">
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}

function Header({ step }: { step: number }) {
  return (
    <div>
      <Link href="/post" className="text-[14px] leading-[20px] tracking-[0.1px] text-[var(--muted-foreground)] hover:text-[var(--primary)] inline-flex items-center gap-1">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
      </Link>
      <h1 className="font-serif text-[28px] leading-[32px] font-medium mt-2">
        {STEP_LABELS[step - 1]}
      </h1>
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
      <div className="flex items-center justify-between text-[14px] leading-[20px] tracking-[0.1px] text-[var(--muted-foreground)] mb-2">
        <span>{completedCount} of {STEP_LABELS.length} steps complete</span>
        <span className="font-medium text-[var(--foreground)]">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--cream)] overflow-hidden">
        <div className="h-full bg-[var(--primary)] transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ol className="mt-5 grid grid-cols-5 gap-2">
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
                className={`w-full h-[64px] text-left rounded-xl px-3 border transition ${
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
                    className={`h-6 w-6 shrink-0 rounded-full grid place-items-center text-[11px] font-semibold ${
                      active
                        ? "bg-[var(--primary)] text-white"
                        : done
                        ? "bg-[var(--success)] text-white"
                        : attn
                        ? "bg-[var(--destructive)] text-white"
                        : "bg-[var(--cream)] text-[var(--muted-foreground)]"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : n}
                  </span>
                  <span className="text-[14px] leading-[20px] font-medium line-clamp-2">{label}</span>
                </div>
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
      <span className="text-[14px] leading-[20px] tracking-[0.1px] font-medium text-[var(--foreground)] flex items-center gap-1">
        {label}
        {required && <span className="text-[var(--accent)]">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && !error && <p className="text-[12px] leading-[16px] tracking-[0.4px] text-[var(--muted-foreground)] mt-1.5">{hint}</p>}
      {error && (
        <p className="text-[14px] leading-[20px] text-[var(--destructive)] mt-1.5 flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      )}
    </label>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-[14px] leading-[20px] outline-none focus:border-[var(--primary)] transition disabled:bg-[var(--cream)]/40 disabled:text-[var(--muted-foreground)]";

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}
function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <div className="relative">
      <select {...props} className={`${inputCls} appearance-none pr-10 ${props.className ?? ""}`}>{props.children}</select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--muted-foreground)]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </div>
  );
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
      className={`rounded-xl border-2 border-dashed p-4 text-center text-[14px] leading-[20px] transition ${
        drag ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)] bg-[var(--cream)]/30"
      }`}
    >
      <Upload className="h-5 w-5 mx-auto text-[var(--muted-foreground)]" />
      {value ? (
        <div className="mt-2">
          <div className="font-medium text-[var(--foreground)]">{value}</div>
          <button type="button" className="text-[14px] leading-[20px] text-[var(--primary)] underline mt-1" onClick={() => onChange("")}>
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
      className={`w-full text-left px-4 py-3 rounded-xl border-2 text-[14px] leading-[20px] transition flex items-start gap-3 ${
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
        {desc && <span className="block text-[14px] leading-[20px] tracking-[0.1px] text-[var(--muted-foreground)] mt-0.5">{desc}</span>}
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
        <h2 className="font-serif text-[20px] leading-[24px] font-medium">Add GST or registration details</h2>
        <p className="text-[14px] leading-[20px] text-[var(--muted-foreground)] mt-1">
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
          desc="I don&apos;t have GST yet"
        />
      </div>
      {errors.gstChoice && (
        <p className="text-[14px] leading-[20px] text-[var(--destructive)] flex items-center gap-1">
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
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={fetchDetails}
              disabled={!data.gstNumber || data.gstNumber.length < 5 || fetching}
              className="ih-btn ih-btn-outline"
            >
              {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {fetching ? "Fetching…" : "Fetch details"}
            </button>
            <a
              href="https://reg.gst.gov.in/registration/"
              target="_blank"
              rel="noopener noreferrer"
              className="ih-btn ih-btn-ghost text-[var(--primary)] px-0"
            >
              Get GST number <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}

      {data.fetched && data.gstNumber && choice === "yes_gst" && (
        <ConfirmCard data={data} />
      )}

      {choice === "eid" && (
        <div className="space-y-4 animate-fade-up">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--cream)]/40 px-4 py-4">
            <div className="space-y-0.5">
              <p className="text-[14px] leading-[20px] font-semibold text-[var(--foreground)]">What is an Enrolment ID (EID)?</p>
              <p className="text-[13px] leading-[18px] text-[var(--muted-foreground)]">
                An EID lets you sell on e-commerce platforms within your state without a GST number.
              </p>
            </div>
            <a href="https://udyamregistration.gov.in/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--primary)] underline-offset-2 hover:underline">
              Get your EID number <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <Field label="Enter Enrolment ID" required error={errors.eidNumber}>
            <TextInput
              value={data.eidNumber ?? ""}
              onChange={(e) => set("eidNumber", e.target.value.toUpperCase())}
              placeholder="292600069119ESX"
              className="tracking-wider"
            />
          </Field>
          <button
            type="button"
            onClick={fetchDetails}
            disabled={!data.eidNumber || data.eidNumber.length < 5 || fetching}
            className="ih-btn ih-btn-outline"
          >
            {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {fetching ? "Fetching…" : "Fetch details"}
          </button>
          {!data.fetched && (
            <a
              href="https://udyamregistration.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="ih-btn ih-btn-ghost text-[var(--primary)] px-0"
            >
              Don&apos;t have one? Get EID number <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
      )}

      {data.fetched && data.eidNumber && data.eidNumber.length >= 15 && choice === "eid" && (
        <ConfirmCard data={data} source="eid" />
      )}


    </div>
  );
}

function ConfirmCard({ data, source }: { data: OnboardingData; source?: "gst" | "eid" }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm hover:shadow-md hover:border-[var(--primary)]/30 transition-all animate-fade-up">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-1 text-[14px] leading-[20px] tracking-[0.1px] font-medium text-[var(--foreground)]">
          <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> Official details fetched
        </div>
      </div>

      <div className="mt-4 space-y-5">
        <dl className="space-y-5">
          <ReadField label="Legal business name" value={data.legalName} />
          <ReadField label="PAN (auto-fetched)" value={data.pan} />
          {source !== "eid" && <ReadField label="CIN (auto-fetched)" value={data.cin} />}
        </dl>

        <div className="border-t border-[var(--border)]" />

        <dl className="space-y-5">
          <ReadField label="Registered address" value={data.registeredAddress} />
        </dl>
      </div>

      <p className="text-[12px] leading-[16px] tracking-[0.4px] text-[var(--muted-foreground)] italic mt-4">
        * These details have been fetched from your {source === "eid" ? "Enrolment ID" : "GST number"}.
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
  large?: boolean;
}) {
  return (
    <div>
      <dt className="text-[12px] leading-[16px] tracking-[0.5px] text-[var(--muted-foreground)]">{label}</dt>
      {editable ? (
        <input
          value={editValue ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          className={inputCls + " mt-1"}
        />
      ) : (
        <dd className="text-[14px] leading-[20px] font-medium mt-0.5">{value ?? "—"}</dd>
      )}
    </div>
  );
}

/* ---------- Step 2 — Shop profile ---------- */

function Step2Shop({ data, set, errors }: StepProps) {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [sending, setSending] = useState(false);
  const [otpError, setOtpError] = useState("");

  const sendOtp = () => {
    setSending(true);
    setTimeout(() => { setSending(false); setOtpSent(true); setOtp(""); setOtpError(""); }, 900);
  };

  const verifyOtp = () => {
    if (otp === "123456") { setVerified(true); setOtpError(""); }
    else setOtpError("Incorrect OTP. Please try again.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-[20px] leading-[24px] font-medium">Tell us about your shop</h2>
        <p className="text-[14px] leading-[20px] text-[var(--muted-foreground)] mt-1">
          These details appear on your India Handmade storefront.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <Field label="Public shop name" required error={errors.publicShopName}>
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

        <div>
          <Field label="Mobile number" required error={errors.mobile}>
            <div className="flex gap-2">
              <div className="flex flex-1 rounded-xl border border-[var(--border)] bg-white focus-within:border-[var(--primary)] overflow-hidden transition">
                <span className="px-3 py-3 text-[14px] text-[var(--muted-foreground)] border-r border-[var(--border)] bg-white select-none">+91</span>
                <input
                  inputMode="numeric" maxLength={10}
                  value={data.mobile ?? ""}
                  onChange={(e) => { set("mobile", e.target.value.replace(/\D/g, "")); setVerified(false); setOtpSent(false); }}
                  placeholder="10-digit mobile"
                  className="flex-1 px-3 py-3 outline-none text-[14px] bg-white"
                  disabled={verified}
                />
              </div>
              {verified ? (
                <span className="flex items-center gap-1 px-3 text-[13px] font-medium text-[var(--success)] whitespace-nowrap">
                  <ShieldCheck className="h-4 w-4" /> Verified
                </span>
              ) : (
                <button type="button" onClick={sendOtp}
                  disabled={!data.mobile || data.mobile.length < 10 || sending}
                  className="ih-btn ih-btn-outline shrink-0 text-[13px] px-3">
                  {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  {sending ? "Sending…" : otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              )}
            </div>
          </Field>

          {otpSent && !verified && (
            <div className="mt-3 animate-fade-up">
              <p className="text-[13px] text-[var(--muted-foreground)] mb-2">
                OTP sent to +91 {data.mobile}. Enter it below.
              </p>
              <div className="flex gap-2">
                <TextInput
                  inputMode="numeric" maxLength={6} value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
                  placeholder="6-digit OTP"
                  className="max-w-[160px] tracking-widest"
                />
                <button type="button" onClick={verifyOtp} disabled={otp.length < 6}
                  className="ih-btn ih-btn-primary text-[13px] px-4">
                  Verify
                </button>
              </div>
              {otpError && (
                <p className="text-[13px] text-[var(--destructive)] mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> {otpError}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="sm:col-span-2">
          <Field label="Shop description (optional)">
            <TextArea
              rows={3}
              value={data.shopDescription ?? ""}
              onChange={(e) => set("shopDescription", e.target.value)}
              placeholder="Tell buyers what makes your shop special — your craft, story, or region"
            />
          </Field>
        </div>
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
    <div className="space-y-4">
      <h2 className="font-serif text-[20px] leading-[24px] font-medium">Address details</h2>

      {hasGstAddress && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--cream)]/40 px-4 py-4">
            <p className="text-[14px] leading-[20px] font-semibold text-[var(--foreground)]">Registered address from GST</p>
            <div className="mt-3 space-y-0.5">
              {data.legalName && <p className="text-[13px] leading-[18px] text-[var(--muted-foreground)]">{data.legalName}</p>}
              <p className="text-[13px] leading-[18px] text-[var(--muted-foreground)]">{data.registeredAddress}</p>
            </div>
          </div>

          <div>
            <div className="text-[14px] leading-[20px] font-medium mb-2">Can we use this as your communication address?</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <OptionRow
              active={data.useGstAddress === true}
              onClick={() => {
                set("useGstAddress", true);
                set("commLine1", data.registeredAddress);
                set("commState", undefined);
                set("commPincode", undefined);
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

      <div className="pt-5 border-t border-[var(--border)] space-y-3">
        <div className="text-[14px] leading-[20px] tracking-[0.1px] font-medium">Is your pickup address the same as your communication address?</div>
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
    <div className="space-y-4 animate-fade-up">
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
        <h2 className="font-serif text-[20px] leading-[24px] font-medium">Add bank account for payouts</h2>
        <p className="text-[14px] leading-[20px] text-[var(--muted-foreground)] mt-1">
          Payments from India Handmade will be sent to this account.
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
        <Field label="IFSC code" required error={errors.ifsc}>
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
        label="Upload bank proof" required
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
    <div className="flex items-center gap-2 text-[14px] leading-[20px]">
      <span className="text-[var(--muted-foreground)]">Bank verification:</span>
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${cls}`}>{label}</span>
    </div>
  );
}

/* ---------- Step 5 — Review ---------- */

function ReviewScreen({ data, goStep }: { data: OnboardingData; goStep: (n: number) => void }) {
  const router = useRouter();
  const { onboarding, updateOnboarding, setOnboardingStatus } = useStore();

  const maskedAccount = useMemo(() => {
    const a = data.accountNumber ?? "";
    if (!a) return "—";
    return "•••• " + a.slice(-4);
  }, [data.accountNumber]);

  const complete = () => {
    [1, 2, 3, 4, 5].forEach((n) => setOnboardingStatus(n, "completed"));
    updateOnboarding({ ...data, bankStatus: data.bankStatus ?? "pending" });
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("justRegistered");
    }
    router.push("/post");
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
    <>
      <Header step={5} />
      <Stepper current={5} statuses={onboarding.statuses} onJump={goStep} />

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
    </>
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
    <section className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm hover:shadow-md hover:border-[var(--primary)]/30 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="h-9 w-9 rounded-full bg-[var(--cream)] grid place-items-center">
            <Icon className="h-4 w-4 text-[var(--primary)]" />
          </span>
          <h3 className="font-serif text-[20px] leading-[24px] font-medium">{title}</h3>
        </div>
        <button onClick={onEdit} className="text-[14px] leading-[20px] text-[var(--primary)] inline-flex items-center gap-1 hover:underline">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
      </div>
      <dl className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-5">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[11px] leading-[16px] tracking-[0.8px] uppercase text-[var(--muted-foreground)]">{k}</dt>
            <dd className="text-[14px] leading-[20px] font-semibold text-[var(--muted-foreground)] mt-1 break-words">{v}</dd>
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
    if (d.gstChoice === "yes_gst") {
      if (!d.gstNumber || d.gstNumber.trim().length !== 15) {
        e.gstNumber = "Enter a valid 15-character GSTIN";
      }
    } else if (d.gstChoice === "eid") {
      if (!d.eidNumber || d.eidNumber.trim().length < 5) {
        e.eidNumber = "Enter a valid EID number";
      }
    }
  }

  if (step === 2) {
    if (!d.publicShopName || d.publicShopName.trim().length === 0) {
      e.publicShopName = "Shop name is required";
    }
    if (!d.craftType || d.craftType.trim().length === 0) {
      e.craftType = "Select a primary craft";
    }
  }

  if (step === 3) {
    if (!d.pickupLine1 || d.pickupLine1.trim().length === 0) {
      e.pickupLine1 = "Pickup address is required";
    }
    if (!d.pickupCity || d.pickupCity.trim().length === 0) {
      e.pickupCity = "City is required";
    }
    if (!d.pickupState || d.pickupState.trim().length === 0) {
      e.pickupState = "State is required";
    }
    if (!d.pickupPincode || !/^\d{6}$/.test(d.pickupPincode.trim())) {
      e.pickupPincode = "Enter a valid 6-digit pincode";
    }
  }

  if (step === 4) {
    if (!d.accountNumber || d.accountNumber.trim().length === 0) {
      e.accountNumber = "Account number is required";
    }
    if (!d.ifsc || d.ifsc.trim().length === 0) {
      e.ifsc = "IFSC code is required";
    }
  }

  return e;
}
