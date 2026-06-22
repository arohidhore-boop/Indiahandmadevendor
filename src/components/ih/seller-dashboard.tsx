"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  Camera,
  Check,
  Copy,
  Download,
  Eye,
  HelpCircle,
  MessageCircle,
  Package,
  PackagePlus,
  ShoppingBag,
  Share2,
  Sparkles,
  Store,
  X,
  CreditCard,
  CircleCheck,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useStore, type Product } from "@/lib/store";

type StoreStatus = "active" | "review" | "needs_changes" | "not_live";

function statusBadge(label: string, kind: "ok" | "warn" | "info" | "muted") {
  const cls = {
    ok: "bg-[var(--success)]/15 text-[var(--success)]",
    warn: "bg-[var(--destructive)]/15 text-[var(--destructive)]",
    info: "bg-[var(--info)]/10 text-[var(--info)]",
    muted: "bg-[var(--cream)] text-[var(--muted-foreground)]",
  }[kind];
  const Icon = kind === "ok" ? CircleCheck : kind === "warn" ? AlertCircle : kind === "info" ? Clock : Check;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${cls}`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

export function SellerDashboard() {
  const { seller, products, onboarding } = useStore();
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const slug = useMemo(
    () => (seller?.shopName ?? "your-shop").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    [seller?.shopName]
  );
  const storeUrl = `indiahandmade.com/store/${slug}`;
  const fullUrl = `https://${storeUrl}`;
  const message = `Hi, my India Handmade store is now live. You can view my handmade products here: ${fullUrl}`;

  const firstProduct: Product | undefined = products[0];
  const productLive = firstProduct?.status === "active";
  const storeStatus: StoreStatus = productLive ? "active" : firstProduct?.status === "review" ? "review" : "not_live";
  const bankVerified = onboarding.data.bankStatus === "verified";

  const isLive = storeStatus === "active";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <>
      {/* Hero + Share */}
      <section className="surface-card p-6 sm:p-8">
        {isLive ? (
            <>
              <h1 className="font-serif text-[28px] leading-[32px] font-medium mt-3">
              Your store is ready
            </h1>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-2 max-w-2xl">
              Your profile is complete. Share your store and start receiving orders.
            </p>

            <div className="mt-6 flex items-stretch gap-2 rounded-[10px] border border-[var(--border)] bg-white p-1.5 max-w-2xl">
              <div className="flex-1 px-3 py-2 text-sm font-mono text-[var(--foreground)] truncate">
                {storeUrl}
              </div>
              <button onClick={copyLink} className="ih-btn ih-btn-primary shrink-0">
                <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noreferrer"
                className="ih-btn ih-btn-outline"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="ih-btn ih-btn-outline"
              >
                <span className="text-lg">📷</span> Instagram
              </a>
              <button onClick={() => setShareOpen(true)} className="ih-btn ih-btn-outline">
                <Download className="h-4 w-4" /> QR code
              </button>
            </div>

          </>
        ) : (
          <>
            <div className="inline-flex items-center gap-1.5 text-[11px] leading-[16px] tracking-[0.5px] font-medium text-[var(--info)] bg-[var(--info)]/10 px-2.5 py-1 rounded-full">
              <Clock className="h-3 w-3" /> Under review
            </div>
            <h1 className="font-serif text-[28px] leading-[32px] font-medium mt-3">
              Your store is almost ready
            </h1>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-2 max-w-2xl">
              We're reviewing your profile and product. We'll notify you as soon as it's live —
              usually within 1–2 business days.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {firstProduct && (
                <Link href="/products" className="ih-btn ih-btn-primary">
                  <Eye className="h-4 w-4" /> View submitted product
                </Link>
              )}
              <Link href="/add-product" className="ih-btn ih-btn-outline">
                <PackagePlus className="h-4 w-4" /> Add another product
              </Link>
              <Link href="/help" className="ih-btn ih-btn-ghost text-[var(--muted-foreground)]">
                <HelpCircle className="h-4 w-4" /> Check review status
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Store status */}
        <div className="surface-card p-6 flex flex-col">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-[var(--cream)] grid place-items-center shrink-0">
              <Store className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <h2 className="font-serif text-[20px] leading-[24px] font-medium">Store status</h2>
          </div>
          <ul className="mt-4 space-y-3 text-[14px] leading-[20px] flex-1">
            <li className="flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Store</span>
              {isLive
                ? statusBadge("Active", "ok")
                : storeStatus === "review"
                ? statusBadge("In review", "info")
                : statusBadge("Not live yet", "muted")}
            </li>
            <li className="flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Profile</span>
              {statusBadge("Complete", "ok")}
            </li>
            <li className="flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Product</span>
              {productLive
                ? statusBadge("1 live", "ok")
                : statusBadge("1 in review", "info")}
            </li>
            <li className="flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Payment</span>
              {bankVerified ? statusBadge("Verified", "ok") : statusBadge("Verification pending", "info")}
            </li>
          </ul>
          <Link href="/profile" className="ih-btn ih-btn-ghost mt-4 text-[var(--primary)] -ml-2">
            View store details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* First product */}
        <div className="surface-card overflow-hidden">
          <div className="w-full h-48 bg-[var(--cream)] grid place-items-center">
            <Camera className="h-12 w-12 text-[var(--muted-foreground)]" />
          </div>
          <div className="p-5">
          {firstProduct ? (
            <div className="mb-4">
              <div className="font-medium truncate">{firstProduct.name}</div>
              <div className="text-[14px] leading-[20px] text-[var(--muted-foreground)] mt-0.5">
                ₹{firstProduct.price.toLocaleString("en-IN")}
              </div>
            </div>
          ) : (
            <p className="text-[14px] leading-[20px] text-[var(--muted-foreground)] mb-4">No product yet.</p>
          )}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-[10px] bg-[var(--cream)]/60 border border-[var(--border)] p-3">
              <div className="font-serif text-[24px] leading-[28px] font-medium">0</div>
              <div className="text-[14px] leading-[20px] text-[var(--muted-foreground)]">Views</div>
            </div>
            <div className="rounded-[10px] bg-[var(--cream)]/60 border border-[var(--border)] p-3">
              <div className="font-serif text-[24px] leading-[28px] font-medium">0</div>
              <div className="text-[14px] leading-[20px] text-[var(--muted-foreground)]">Orders</div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/products" className="ih-btn ih-btn-outline w-full justify-center">Manage product</Link>
            <Link href="/add-product" className="ih-btn ih-btn-primary w-full justify-center">
              <PackagePlus className="h-4 w-4" /> Add another
            </Link>
          </div>
          </div>
        </div>

        {/* Orders */}
        <div className="surface-card p-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-[var(--cream)] grid place-items-center shrink-0">
              <ShoppingBag className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <h2 className="font-serif text-[20px] leading-[24px] font-medium">Orders</h2>
          </div>
          <div className="mt-4 text-center py-6">
            <div className="h-14 w-14 rounded-full bg-[var(--cream)] grid place-items-center mx-auto">
              <ShoppingBag className="h-6 w-6 text-[var(--muted-foreground)]" />
            </div>
            <div className="font-medium mt-3">No orders yet</div>
            <p className="text-sm text-[var(--muted-foreground)] mt-1 max-w-xs mx-auto">
              Share your store link with customers. When someone places an order, it will appear here.
            </p>
            <button onClick={() => setShareOpen(true)} className="ih-btn ih-btn-primary mt-4">
              <Share2 className="h-4 w-4" /> Share store
            </button>
          </div>
        </div>

        {/* Next actions */}
        <div className="lg:col-span-2 surface-card p-6">
          <h2 className="font-serif text-[20px] leading-[24px] font-medium">What you can do next</h2>
          <ul className="mt-4 divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden">
            <NextAction
              icon={Share2}
              label="Share your store with customers"
              cta="Share now"
              onClick={() => setShareOpen(true)}
            />
            <NextAction
              icon={PackagePlus}
              label="Add 3 more products"
              cta="Add product"
              to="/add-product"
            />
            <NextAction
              icon={Store}
              label="Improve your shop story"
              cta="Edit shop story"
              to="/profile"
            />
            <NextAction
              icon={HelpCircle}
              label="Learn how orders and pickup work"
              cta="Read seller guide"
              to="/help"
            />
          </ul>
        </div>

        {/* Store activity */}
        <div className="surface-card p-6">
          <h2 className="font-serif text-[20px] leading-[24px] font-medium">Store activity</h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Your store just opened. Numbers grow as you share.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Metric label="Store views" value="0" />
            <Metric label="Product views" value="0" />
            <Metric label="Orders" value="0" />
            <Metric label="Revenue" value="₹0" />
          </div>
        </div>

        {/* Help */}
        <div className="lg:col-span-3 surface-card p-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-[var(--cream)] grid place-items-center shrink-0">
              <HelpCircle className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <h2 className="font-serif text-[20px] leading-[24px] font-medium">Need help getting your first order?</h2>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <HelpLink label="How to share your store" />
            <HelpLink label="How pickup works" />
            <HelpLink label="How payments work" />
            <HelpLink label="Contact support" />
          </div>
        </div>
      </section>

      {shareOpen && (
        <ShareModal
          storeUrl={storeUrl}
          fullUrl={fullUrl}
          message={message}
          onClose={() => setShareOpen(false)}
        />
      )}
    </>
  );
}

function NextAction({
  icon: Icon,
  label,
  cta,
  to,
  onClick,
}: {
  icon: typeof Check;
  label: string;
  cta: string;
  to?: "/add-product" | "/profile" | "/help";
  onClick?: () => void;
}) {
  const content = (
    <li className="flex items-center gap-4 p-4 hover:bg-[var(--cream)]/60 transition group cursor-pointer">
      <span className="h-9 w-9 rounded-full bg-[var(--cream)] text-[var(--primary)] grid place-items-center shrink-0">
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex-1 min-w-0 font-medium text-[14px] leading-[20px]">{label}</div>
      <span className="text-sm font-medium text-[var(--primary)] inline-flex items-center gap-1 group-hover:gap-2 transition-all">
        {cta} <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </li>
  );
  if (to) return <Link href={to}>{content}</Link>;
  return <button onClick={onClick} className="w-full text-left">{content}</button>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] bg-[var(--cream)]/60 border border-[var(--border)] p-3">
      <div className="text-[14px] leading-[20px] text-[var(--muted-foreground)]">{label}</div>
      <div className="font-serif text-[24px] leading-[28px] font-medium mt-0.5">{value}</div>
    </div>
  );
}

function HelpLink({ label }: { label: string }) {
  return (
    <Link
              href="/help"
      className="flex items-center justify-between gap-2 p-3 rounded-[10px] border border-[var(--border)] hover:bg-[var(--cream)]/60 transition text-[14px] leading-[20px] font-medium"
    >
      {label}
      <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)]" />
    </Link>
  );
}

function ShareModal({
  storeUrl,
  fullUrl,
  message,
  onClose,
}: {
  storeUrl: string;
  fullUrl: string;
  message: string;
  onClose: () => void;
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  const copy = async (text: string, kind: "link" | "msg") => {
    try {
      await navigator.clipboard.writeText(text);
      if (kind === "link") {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 1800);
      } else {
        setCopiedMsg(true);
        setTimeout(() => setCopiedMsg(false), 1800);
      }
    } catch {}
  };

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullUrl)}`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 animate-fade-in p-4" onClick={onClose}>
      <div
        className="relative max-w-lg w-full surface-card p-6 sm:p-7 animate-fade-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 h-8 w-8 grid place-items-center rounded-full hover:bg-[var(--cream)] text-[var(--muted-foreground)]"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <h2 className="font-serif text-[24px] leading-[28px] font-medium">Share your store</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Use this link to invite customers to view your handmade products.
        </p>

        <div className="mt-4 flex items-stretch gap-2 rounded-[10px] border border-[var(--border)] bg-white p-1.5">
          <div className="flex-1 px-3 py-2 text-sm font-mono truncate">{storeUrl}</div>
          <button onClick={() => copy(fullUrl, "link")} className="ih-btn ih-btn-primary shrink-0">
            <Copy className="h-4 w-4" /> {copiedLink ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" className="ih-btn ih-btn-outline justify-center">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="ih-btn ih-btn-outline justify-center">
            <span className="text-lg">📷</span> Instagram
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`} target="_blank" rel="noreferrer" className="ih-btn ih-btn-outline justify-center">
            <span className="text-lg">📘</span> Facebook
          </a>
          <a href={qrSrc} download="store-qr.png" target="_blank" rel="noreferrer" className="ih-btn ih-btn-outline justify-center">
            <Download className="h-4 w-4" /> QR code
          </a>
        </div>

        <div className="mt-5 flex gap-4 items-start">
          <img
            src={qrSrc}
            alt="Store QR code"
            className="h-28 w-28 rounded-[10px] border border-[var(--border)] bg-white p-2 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] leading-[16px] tracking-[0.5px] text-[var(--muted-foreground)]">
              Message preview
            </div>
            <div className="mt-1 p-3 rounded-[10px] bg-[var(--cream)]/60 border border-[var(--border)] text-sm">
              {message}
            </div>
            <button
              onClick={() => copy(message, "msg")}
              className="ih-btn ih-btn-ghost mt-2 -ml-2 text-[var(--primary)]"
            >
              <Copy className="h-4 w-4" /> {copiedMsg ? "Message copied" : "Copy message"}
            </button>
          </div>
        </div>

        <button onClick={onClose} className="ih-btn ih-btn-outline mt-5 w-full justify-center">
          Done
        </button>
      </div>
    </div>,
    document.body
  );
}
