import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  Check,
  Circle,
  PartyPopper,
  X,
  PackagePlus,
  BookOpen,
  AlertCircle,
  Clock,
  Lock,
  Landmark,
  Store,
  MapPin,
  Building2,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/ih/AppShell";
import { SellerDashboard } from "@/components/ih/SellerDashboard";
import { useIH, type OnboardingStatus, type BankStatus } from "@/lib/ih-store";

export const Route = createFileRoute("/post")({
  head: () => ({ meta: [{ title: "Post — India Handmade" }] }),
  component: Home,
});

const PROFILE_STEPS: { n: number; label: string; desc: string; icon: typeof Check }[] = [
  { n: 1, label: "GST / registration details", desc: "Add GST, EID, or skip for now", icon: Landmark },
  { n: 2, label: "Shop profile", desc: "Public name, contact and craft", icon: Store },
  { n: 3, label: "Address", desc: "Communication, pickup and return", icon: MapPin },
  { n: 4, label: "Payment setup", desc: "Bank account for payouts", icon: Building2 },
];

function Home() {
  const { seller, onboarding } = useIH();
  const [justRegistered, setJustRegistered] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("justRegistered") === "1") {
      setJustRegistered(true);
    }
  }, []);

  const dismissOverlay = () => {
    sessionStorage.removeItem("justRegistered");
    setJustRegistered(false);
  };

  const statuses = onboarding.statuses;
  const profileCompleted = PROFILE_STEPS.every((s) => statuses[s.n] === "completed");
  const completedSteps = PROFILE_STEPS.filter((s) => statuses[s.n] === "completed").length;
  const firstProductDone = onboarding.firstProductAdded;
  const totalSteps = PROFILE_STEPS.length + 1; // + first product
  const totalCompleted = completedSteps + (firstProductDone ? 1 : 0);
  const pct = Math.round((totalCompleted / totalSteps) * 100);
  const nextStep = PROFILE_STEPS.find((s) => statuses[s.n] !== "completed");

  const showSellerDashboard = profileCompleted && firstProductDone;

  return (
    <AppShell>
      {showSellerDashboard ? (
        <SellerDashboard />
      ) : (
        <HomeOnboarding
          justRegistered={justRegistered}
          dismissOverlay={dismissOverlay}
          seller={seller}
          profileCompleted={profileCompleted}
          completedSteps={completedSteps}
          firstProductDone={firstProductDone}
          totalSteps={totalSteps}
          totalCompleted={totalCompleted}
          pct={pct}
          nextStep={nextStep}
          statuses={statuses}
          onboarding={onboarding}
        />
      )}
    </AppShell>
  );
}

type HomeOnboardingProps = {
  justRegistered: boolean;
  dismissOverlay: () => void;
  seller: ReturnType<typeof useIH>["seller"];
  profileCompleted: boolean;
  completedSteps: number;
  firstProductDone: boolean;
  totalSteps: number;
  totalCompleted: number;
  pct: number;
  nextStep: typeof PROFILE_STEPS[number] | undefined;
  statuses: Record<number, OnboardingStatus>;
  onboarding: ReturnType<typeof useIH>["onboarding"];
};

function HomeOnboarding({
  justRegistered,
  dismissOverlay,
  seller,
  profileCompleted,
  completedSteps,
  firstProductDone,
  totalSteps,
  totalCompleted,
  pct,
  nextStep,
  statuses,
  onboarding,
}: HomeOnboardingProps) {
  return (
    <>

      {justRegistered && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 animate-fade-in p-4">
          <div className="relative max-w-md w-full surface-card p-8 text-center animate-fade-up">
            <button
              onClick={dismissOverlay}
              className="absolute top-3 right-3 h-8 w-8 grid place-items-center rounded-full hover:bg-[var(--cream)] text-[var(--muted-foreground)]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="h-16 w-16 rounded-full bg-[var(--primary)]/10 grid place-items-center mx-auto">
              <PartyPopper className="h-8 w-8 text-[var(--primary)]" />
            </div>
            <h2 className="font-serif text-2xl mt-5">Congratulations!</h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-2">
              You are now registered on India Handmade. Complete your profile to start selling.
            </p>
            <button onClick={dismissOverlay} className="ih-btn ih-btn-primary mt-6 w-full justify-center">
              Continue
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Welcome */}
      <div>
        <h1 className="font-serif text-[28px] sm:text-[32px] leading-tight">
          Welcome to India Handmade, {seller?.name ?? "seller"}
        </h1>
        <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-2 max-w-2xl">
          {profileCompleted
            ? "Your profile is ready. Add your first handmade product to start receiving orders."
            : "Complete your profile so we can verify your details, help customers discover your shop, and set up payouts."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT — Complete your profile card */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="surface-card p-6 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-[200px]">
                {profileCompleted ? (
                  <>
                    <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-medium text-[var(--success)] bg-[var(--success)]/10 px-2.5 py-1 rounded-full">
                      <Check className="h-3 w-3" /> Profile complete
                    </div>
                    <h2 className="font-serif text-xl mt-2">Your seller profile is ready</h2>
                  </>
                ) : (
                  <>
                    <h2 className="font-serif text-xl">Complete your profile</h2>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1 max-w-md">
                      Add your GST or registration details, confirm your shop information, add your address, and set up your bank account for payouts.
                    </p>
                  </>
                )}
                <p className="text-sm font-medium mt-3">
                  {totalCompleted} of {totalSteps} steps complete
                </p>
              </div>
              <div className="font-serif text-3xl text-[var(--primary)]">{pct}%</div>
            </div>

            <div className="mt-3 h-2.5 rounded-full bg-[var(--cream)] overflow-hidden">
              <div className="h-full bg-[var(--primary)] transition-all" style={{ width: `${pct}%` }} />
            </div>

            <ul className="mt-6 divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden">
              {PROFILE_STEPS.map((s) => {
                const status = statuses[s.n] ?? "not_started";
                return (
                  <li key={s.n}>
                    <Link
                      to="/onboarding"
                      search={{ step: s.n }}
                      className="flex items-center gap-4 p-4 hover:bg-[var(--cream)]/60 transition group"
                    >
                      <span className={`h-9 w-9 rounded-full grid place-items-center shrink-0 ${statusIconBg(status)}`}>
                        {status === "completed" ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base">{s.label}</div>
                        <div className="text-xs text-[var(--muted-foreground)] mt-0.5 truncate">{s.desc}</div>
                      </div>
                      <StatusBadge
                        status={status}
                        bankStatus={s.n === 4 ? onboarding.data.bankStatus : undefined}
                      />
                      <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)] group-hover:translate-x-1 group-hover:text-[var(--primary)] transition hidden sm:block" />
                    </Link>
                  </li>
                );
              })}
              {/* First product checklist row */}
              <li>
                <Link
                  to="/add-product"
                  className={`flex items-center gap-4 p-4 transition group ${
                    profileCompleted ? "hover:bg-[var(--cream)]/60" : "opacity-60 pointer-events-none"
                  }`}
                >
                  <span className={`h-9 w-9 rounded-full grid place-items-center shrink-0 ${firstProductDone ? "bg-[var(--success)] text-white" : "bg-[var(--cream)] text-[var(--muted-foreground)]"}`}>
                    {firstProductDone ? <Check className="h-4 w-4" /> : <PackagePlus className="h-4 w-4" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm sm:text-base">Add your first product</div>
                    <div className="text-xs text-[var(--muted-foreground)] mt-0.5 truncate">
                      Available after profile completion
                    </div>
                  </div>
                  {firstProductDone ? (
                    <StatusBadge status="completed" />
                  ) : (
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--cream)] text-[var(--muted-foreground)]">
                      <Lock className="h-3 w-3" /> Locked
                    </span>
                  )}
                </Link>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {!profileCompleted ? (
                <Link
                  to="/onboarding"
                  search={{ step: nextStep?.n ?? 1 }}
                  className="ih-btn ih-btn-primary"
                >
                  {completedSteps === 0 ? "Complete profile" : "Continue profile setup"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link to="/add-product" className="ih-btn ih-btn-primary">
                  Add first product <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <Link to="/help" className="ih-btn ih-btn-ghost text-[var(--muted-foreground)]">
                Need help?
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT — Add first product + guide */}
        <div className="flex flex-col gap-4">
          <FirstProductCard locked={!profileCompleted} done={firstProductDone} />
          <QuickAction icon={BookOpen} label="View seller guide" to="/help" />
        </div>
      </div>
    </>
  );
}

function FirstProductCard({ locked, done }: { locked: boolean; done: boolean }) {
  const body = (
    <div className={`surface-card p-5 flex flex-col gap-3 ${locked ? "opacity-70" : "hover-lift group"}`}>
      <div className="flex items-center gap-3">
        <div className={`h-11 w-11 rounded-full grid place-items-center shrink-0 ${done ? "bg-[var(--success)]/15" : "bg-[var(--cream)]"}`}>
          {done ? <Check className="h-5 w-5 text-[var(--success)]" /> : <PackagePlus className="h-5 w-5 text-[var(--primary)]" />}
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm">Add your first product</div>
          <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
            {locked ? "Unlocks after profile" : done ? "Great — keep adding more" : "List your first handmade item"}
          </div>
        </div>
        {locked ? (
          <Lock className="h-4 w-4 text-[var(--muted-foreground)]" />
        ) : (
          <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)] group-hover:translate-x-1 group-hover:text-[var(--primary)] transition" />
        )}
      </div>
      {!locked && !done && (
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--accent)]">
          <Sparkles className="h-3 w-3" /> Recommended next step
        </div>
      )}
    </div>
  );
  if (locked) return <div>{body}</div>;
  return <Link to="/add-product">{body}</Link>;
}

function statusIconBg(status: OnboardingStatus) {
  switch (status) {
    case "completed":
      return "bg-[var(--success)] text-white";
    case "in_progress":
      return "bg-[var(--info)]/15 text-[var(--info)]";
    case "needs_attention":
      return "bg-[var(--destructive)]/15 text-[var(--destructive)]";
    default:
      return "bg-[var(--cream)] text-[var(--muted-foreground)]";
  }
}

function StatusBadge({ status, bankStatus }: { status: OnboardingStatus; bankStatus?: BankStatus }) {
  // If bank step is completed but verification is pending, show pending verification
  if (bankStatus && status === "completed") {
    if (bankStatus === "pending") {
      return (
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--info)]/10 text-[var(--info)]">
          <Clock className="h-3 w-3" /> Verification pending
        </span>
      );
    }
    if (bankStatus === "verified") {
      return (
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--success)]/15 text-[var(--success)]">
          <Check className="h-3 w-3" /> Verified
        </span>
      );
    }
    if (bankStatus === "needs_correction") {
      return (
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--destructive)]/15 text-[var(--destructive)]">
          <AlertCircle className="h-3 w-3" /> Needs correction
        </span>
      );
    }
  }
  const map: Record<OnboardingStatus, { label: string; cls: string; icon: typeof Check }> = {
    not_started: { label: "Not started", cls: "bg-[var(--cream)] text-[var(--muted-foreground)]", icon: Circle },
    in_progress: { label: "In progress", cls: "bg-[var(--info)]/10 text-[var(--info)]", icon: Clock },
    completed: { label: "Complete", cls: "bg-[var(--success)]/15 text-[var(--success)]", icon: Check },
    needs_attention: { label: "Needs attention", cls: "bg-[var(--destructive)]/15 text-[var(--destructive)]", icon: AlertCircle },
  };
  const { label, cls, icon: Icon } = map[status];
  return (
    <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${cls}`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

function QuickAction({
  icon: Icon,
  label,
  to,
}: {
  icon: typeof Check;
  label: string;
  to: "/add-product" | "/help";
}) {
  const inner = (
    <>
      <div className="h-11 w-11 rounded-full bg-[var(--cream)] grid place-items-center shrink-0">
        <Icon className="h-5 w-5 text-[var(--primary)]" />
      </div>
      <div className="flex-1 font-medium text-sm">{label}</div>
      <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)] group-hover:translate-x-1 group-hover:text-[var(--primary)] transition" />
    </>
  );
  const cls = "surface-card p-5 flex items-center gap-3 hover-lift group";
  if (to === "/add-product") return <Link to="/add-product" className={cls}>{inner}</Link>;
  return <Link to="/help" className={cls}>{inner}</Link>;
}
