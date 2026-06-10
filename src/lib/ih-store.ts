import { useEffect, useState, useSyncExternalStore } from "react";

export type ProductStatus = "active" | "draft" | "review" | "out";
export type Product = {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  price: number;
  stock?: number;
  status: ProductStatus;
  imageUrl?: string;
  emoji?: string;
};
export type Seller = {
  email: string;
  name: string;
  initials: string;
  sellerType: string;
  shopName?: string;
  city?: string;
  state?: string;
  primaryCraft?: string;
  gst?: string;
  eid?: string;
  hasProfile?: boolean;
};

export type OnboardingStatus = "not_started" | "in_progress" | "completed" | "needs_attention";

export type GstChoice = "yes_gst" | "eid" | "no_gst" | "skip";
export type ArtisanBody = "textiles" | "state" | "both" | "no" | "skip";
export type BankStatus = "not_added" | "pending" | "verified" | "needs_correction";

export type OnboardingData = {
  // Step 1 — GST / registration
  gstChoice?: GstChoice;
  gstNumber?: string;
  eidNumber?: string;
  fetched?: boolean;
  legalName?: string;
  tradeName?: string;
  registeredAddress?: string;
  registrationStatus?: string;
  fetchedState?: string;
  fetchedPincode?: string;
  pan?: string;
  cin?: string;

  // Step 2 — Shop profile
  publicShopName?: string;
  sellerType?: string;
  contactName?: string;
  mobile?: string;
  craftType?: string;
  additionalCraftType?: string;

  // Conditional — Artisan
  artisanBody?: ArtisanBody;
  artisanCardNumber?: string;
  stateRegNumber?: string;
  stateDeptName?: string;
  artisanDocName?: string;

  // Conditional — Organisation
  orgName?: string;
  orgRegistrationType?: string;
  orgRegistrationNumber?: string;
  contactPersonRole?: string;
  orgProofDocName?: string;

  // Step 3 — Address
  useGstAddress?: boolean;
  commLine1?: string;
  commLine2?: string;
  commState?: string;
  commCity?: string;
  commPincode?: string;
  commMobile?: string;
  pickupSameAsComm?: boolean;
  pickupLine1?: string;
  pickupLine2?: string;
  pickupState?: string;
  pickupCity?: string;
  pickupPincode?: string;
  returnSameAsPickup?: boolean;
  returnLine1?: string;
  returnLine2?: string;
  returnState?: string;
  returnCity?: string;
  returnPincode?: string;

  // Step 4 — Payment
  accountHolder?: string;
  accountNumber?: string;
  confirmAccountNumber?: string;
  ifsc?: string;
  bankName?: string;
  branch?: string;
  upiId?: string;
  bankProofDoc?: string;
  bankStatus?: BankStatus;
};

export type OnboardingState = {
  data: OnboardingData;
  statuses: Record<number, OnboardingStatus>;
  firstProductAdded: boolean;
};

type State = {
  seller: Seller | null;
  products: Product[];
  profileSteps: { bank: boolean; business: boolean; recognition: boolean };
  onboarding: OnboardingState;
};

const KEY = "ih:v1";

const seed: Product[] = [
  { id: "p1", name: "Hand-woven Banarasi Dupatta", category: "Handloom", subCategory: "Banarasi", price: 2400, stock: 12, status: "active", emoji: "🟥" },
  { id: "p2", name: "Blue Pottery Vase Set", category: "Handicraft", subCategory: "Blue Pottery", price: 1850, stock: 5, status: "active", emoji: "🏺" },
  { id: "p3", name: "Madhubani Painting — Large", category: "Painting", subCategory: "Madhubani", price: 3200, stock: 2, status: "active", emoji: "🎨" },
  { id: "p4", name: "Brass Diya Set (8 pieces)", category: "Metal Craft", subCategory: "Brass", price: 980, status: "draft", emoji: "🪔" },
  { id: "p5", name: "Warli Art Wall Panel", category: "Painting", subCategory: "Warli", price: 1600, stock: 8, status: "review", emoji: "🖼" },
];

const defaults: State = {
  seller: {
    email: "samba@example.in",
    name: "Samba Sakhi",
    initials: "SM",
    sellerType: "Producer Company",
    shopName: "Samba Sakhi Crafts",
    city: "Jaipur",
    state: "Rajasthan",
    primaryCraft: "Handloom",
    hasProfile: true,
  },
  products: seed,
  profileSteps: { bank: false, business: false, recognition: false },
  onboarding: {
    data: {},
    statuses: { 1: "not_started", 2: "not_started", 3: "not_started", 4: "not_started", 5: "not_started", 6: "not_started" },
    firstProductAdded: false,
  },
};

let state: State = load();
const listeners = new Set<() => void>();

function load(): State {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed, onboarding: { ...defaults.onboarding, ...(parsed.onboarding ?? {}) } };
  } catch { return defaults; }
}
function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export const ihStore = {
  subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); },
  get() { return state; },
  setSeller(patch: Partial<Seller>) {
    const cur = state.seller ?? defaults.seller!;
    state = { ...state, seller: { ...cur, ...patch } };
    persist();
  },
  addProduct(p: Omit<Product, "id">) {
    const np: Product = { ...p, id: crypto.randomUUID() };
    state = { ...state, products: [np, ...state.products], onboarding: { ...state.onboarding, firstProductAdded: true, statuses: { ...state.onboarding.statuses, 6: "completed" } } };
    persist();
    return np;
  },
  completeStep(k: keyof State["profileSteps"]) {
    state = { ...state, profileSteps: { ...state.profileSteps, [k]: true } };
    persist();
  },
  updateOnboarding(patch: Partial<OnboardingData>) {
    state = { ...state, onboarding: { ...state.onboarding, data: { ...state.onboarding.data, ...patch } } };
    persist();
  },
  setOnboardingStatus(step: number, status: OnboardingStatus) {
    state = { ...state, onboarding: { ...state.onboarding, statuses: { ...state.onboarding.statuses, [step]: status } } };
    persist();
  },
};

export function useIH() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const snap = useSyncExternalStore(ihStore.subscribe, () => state, () => defaults);
  return hydrated ? snap : defaults;
}
