"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type ProductStatus = "active" | "draft" | "review" | "out";
export type Product = {
  id: string; name: string; category: string; subCategory?: string;
  price: number; stock?: number; status: ProductStatus; imageUrl?: string; emoji?: string;
};
export type Seller = {
  email: string; name: string; initials: string; sellerType: string;
  shopName?: string; city?: string; state?: string; primaryCraft?: string;
  gst?: string; eid?: string; hasProfile?: boolean;
};
export type OnboardingStatus = "not_started" | "in_progress" | "completed" | "needs_attention";
export type GstChoice = "yes_gst" | "eid" | "no_gst" | "skip";
export type ArtisanBody = "textiles" | "state" | "both" | "no" | "skip";
export type BankStatus = "not_added" | "pending" | "verified" | "needs_correction";
export type OnboardingData = {
  gstChoice?: GstChoice; gstNumber?: string; eidNumber?: string; fetched?: boolean;
  legalName?: string; tradeName?: string; registeredAddress?: string;
  registrationStatus?: string; fetchedState?: string; fetchedPincode?: string;
  pan?: string; cin?: string;
  publicShopName?: string; shopDescription?: string; sellerType?: string;
  contactName?: string; mobile?: string; craftType?: string; additionalCraftType?: string;
  artisanBody?: ArtisanBody; artisanCardNumber?: string; stateRegNumber?: string;
  stateDeptName?: string; artisanDocName?: string;
  orgName?: string; orgRegistrationType?: string; orgRegistrationNumber?: string;
  contactPersonRole?: string; orgProofDocName?: string;
  useGstAddress?: boolean; commLine1?: string; commLine2?: string;
  commState?: string; commCity?: string; commPincode?: string; commMobile?: string;
  pickupSameAsComm?: boolean; pickupLine1?: string; pickupLine2?: string;
  pickupState?: string; pickupCity?: string; pickupPincode?: string;
  returnSameAsPickup?: boolean; returnLine1?: string; returnLine2?: string;
  returnState?: string; returnCity?: string; returnPincode?: string;
  accountHolder?: string; accountNumber?: string; confirmAccountNumber?: string;
  ifsc?: string; bankName?: string; branch?: string; upiId?: string;
  bankProofDoc?: string; bankStatus?: BankStatus;
};
export type OnboardingState = {
  data: OnboardingData; statuses: Record<number, OnboardingStatus>; firstProductAdded: boolean;
};

const SEED: Product[] = [
  { id: "p1", name: "Hand-woven Banarasi Dupatta", category: "Handloom", subCategory: "Banarasi", price: 2400, stock: 12, status: "active", emoji: "🟥" },
  { id: "p2", name: "Blue Pottery Vase Set", category: "Handicraft", subCategory: "Blue Pottery", price: 1850, stock: 5, status: "active", emoji: "🏺" },
  { id: "p3", name: "Madhubani Painting — Large", category: "Painting", subCategory: "Madhubani", price: 3200, stock: 2, status: "active", emoji: "🎨" },
  { id: "p4", name: "Brass Diya Set (8 pieces)", category: "Metal Craft", subCategory: "Brass", price: 980, status: "draft", emoji: "🪔" },
  { id: "p5", name: "Warli Art Wall Panel", category: "Painting", subCategory: "Warli", price: 1600, stock: 8, status: "review", emoji: "🖼" },
];

const DEFAULT_SELLER: Seller = {
  email: "samba@example.in", name: "Samba Sakhi", initials: "SM",
  sellerType: "Producer Company", shopName: "Samba Sakhi Crafts",
  city: "Jaipur", state: "Rajasthan", primaryCraft: "Handloom", hasProfile: true,
};

const DEFAULT_ONBOARDING: OnboardingState = {
  data: {
    gstChoice: "yes_gst", gstNumber: "27AABCS1429B1ZB", fetched: true,
    legalName: "Samba Sakhi Crafts Producer Company Limited", tradeName: "Samba Sakhi Crafts",
    registeredAddress: "12 Old City Road, Pink City, Jaipur Urban, Rajasthan Pincode - 302002",
    registrationStatus: "Active", fetchedState: "Rajasthan", fetchedPincode: "302002",
    pan: "AAACS1234F", cin: "U17299RJ2019PTC065432",
    publicShopName: "Samba Sakhi Crafts", sellerType: "Producer Company",
    contactName: "Neha Kumar", mobile: "9876543210",
    useGstAddress: true, commLine1: "12 Old City Road, Pink City, Jaipur Urban, Rajasthan Pincode - 302002",
    commMobile: "9876543210", pickupSameAsComm: true, returnSameAsPickup: true,
    accountHolder: "Samba Sakhi Crafts Producer Company", accountNumber: "50200012345678",
    confirmAccountNumber: "50200012345678", ifsc: "HDFC0001234",
    bankName: "HDFC Bank", branch: "Jaipur Main Branch",
  },
  statuses: { 1: "not_started", 2: "not_started", 3: "not_started", 4: "not_started", 5: "not_started", 6: "not_started" },
  firstProductAdded: false,
};

type AppState = {
  seller: Seller; products: Product[];
  profileSteps: { bank: boolean; business: boolean; recognition: boolean };
  onboarding: OnboardingState;
};

const DEFAULTS: AppState = {
  seller: DEFAULT_SELLER, products: SEED,
  profileSteps: { bank: false, business: false, recognition: false },
  onboarding: DEFAULT_ONBOARDING,
};

const KEY = "ih:v1";

function load(): AppState {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch { return DEFAULTS; }
}

function save(state: AppState) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

type StoreCtx = AppState & {
  setSeller: (patch: Partial<Seller>) => void;
  addProduct: (p: Omit<Product, "id">) => void;
  updateOnboarding: (patch: Partial<OnboardingData>) => void;
  setOnboardingStatus: (step: number, status: OnboardingStatus) => void;
  resetOnboarding: () => void;
  signOut: () => void;
};

const StoreContext = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULTS);

  useEffect(() => { setState(load()); }, []);


  const setSeller = useCallback((patch: Partial<Seller>) => {
    setState(prev => { const next = { ...prev, seller: { ...prev.seller, ...patch } }; save(next); return next; });
  }, []);

  const addProduct = useCallback((p: Omit<Product, "id">) => {
    const np: Product = { ...p, id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) };
    setState(prev => {
      const next = { ...prev, products: [np, ...prev.products], onboarding: { ...prev.onboarding, firstProductAdded: true } };
      save(next); return next;
    });
  }, []);

  const updateOnboarding = useCallback((patch: Partial<OnboardingData>) => {
    setState(prev => {
      const next = { ...prev, onboarding: { ...prev.onboarding, data: { ...prev.onboarding.data, ...patch } } };
      save(next); return next;
    });
  }, []);

  const setOnboardingStatus = useCallback((step: number, status: OnboardingStatus) => {
    setState(prev => {
      const next = { ...prev, onboarding: { ...prev.onboarding, statuses: { ...prev.onboarding.statuses, [step]: status } } };
      save(next); return next;
    });
  }, []);

  const resetOnboarding = useCallback(() => {
    setState(prev => { const next = { ...prev, onboarding: DEFAULT_ONBOARDING }; save(next); return next; });
  }, []);

  const signOut = useCallback(() => {
    if (typeof window !== "undefined") {
      try { localStorage.removeItem(KEY); } catch {}
      try { sessionStorage.removeItem("justRegistered"); } catch {}
    }
    setState(DEFAULTS);
  }, []);

  return (
    <StoreContext.Provider value={{ ...state, setSeller, addProduct, updateOnboarding, setOnboardingStatus, resetOnboarding, signOut }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
