import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  HandHeart,
  BadgePercent,
  Truck,
  Sparkles,
  Users,
  Palette,
  IndianRupee,
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  Menu,
  X,
} from "lucide-react";
import { GovBar } from "@/components/ih/GovBar";
import { BrandMark } from "@/components/ih/BrandMark";
import heroArtisan from "@/assets/hero-artisan.jpg";
import artisanPotter from "@/assets/artisan-woodcarver.jpg";
import artisanPrinter from "@/assets/artisan-mysore.jpg";
import artisanPainter from "@/assets/artisan-sakhi.jpg";
import catClothing from "@/assets/cat-clothing.jpg";
import catDecor from "@/assets/cat-decor.jpg";
import catPaintings from "@/assets/cat-paintings.jpg";
import catHandicraft from "@/assets/cat-handicraft.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "India Handmade — Start selling your handmade products" },
      {
        name: "description",
        content:
          "Sell handmade products directly to customers across India. No middlemen, no commission. Built for artisans.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-[var(--cream)]">
      <GovBar />
      <header className="h-[72px] bg-white border-b border-[var(--border)] sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
          <BrandMark />
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="sm:hidden h-9 w-9 rounded-lg border border-[var(--border)] flex items-center justify-center bg-white"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/login" className="text-[14px] leading-[20px] font-medium text-[var(--primary)] hover:underline">
              Sign in
            </Link>
            <Link to="/signup" className="ih-btn ih-btn-primary hidden sm:inline-flex">
              Start selling
            </Link>
          </div>
        </div>
      </header>
      {mobileOpen && (
        <div className="sm:hidden bg-white border-b border-[var(--border)] px-6 py-4 space-y-3 animate-fade-up">
          <Link to="/login" className="block text-[14px] font-medium text-[var(--foreground)] hover:text-[var(--primary)]">Sign in</Link>
          <Link to="/signup" className="ih-btn ih-btn-primary w-full justify-center">Start selling</Link>
        </div>
      )}

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-16 lg:py-20 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
            <div className="animate-fade-up">
              <h1 className="font-serif text-[44px] lg:text-[58px] leading-[1.05] text-[var(--foreground)]">
                Start selling your{" "}
                <em className="text-primary not-italic">handmade</em> products across India
              </h1>
              <p className="mt-5 text-[18px] leading-[28px] text-[var(--muted-foreground)] max-w-[520px]">
                Sell directly to customers. No middlemen. No commission.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/signup" className="ih-btn ih-btn-primary hover-lift">
                  Start selling <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#why" className="ih-btn ih-btn-outline">
                  Learn more
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 rounded-[28px] bg-[var(--marigold)]/15 -z-10" />
              <div className="overflow-hidden rounded-[24px] border border-[var(--border)] shadow-[var(--shadow-lift)] bg-white">
                <img
                  src={heroArtisan}
                  alt="Indian artisan hand-carving an ornate wooden panel"
                  width={1280}
                  height={1280}
                  decoding="async"
                  className="w-full h-[480px] lg:h-[560px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* WHY */}
        <section id="why" className="bg-white border-y border-[var(--border)]">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-20">
            <div className="max-w-[680px]">
              <h2 className="font-serif text-[40px] leading-[48px] font-medium">
                Why artisans choose <em className="text-[var(--primary)] not-italic">India Handmade</em>
              </h2>
              <p className="mt-4 text-[16px] leading-[24px] text-[var(--muted-foreground)]">
                A platform built around the people who make. Keep your craft, your story, and your earnings.
              </p>
            </div>
            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { Icon: Users, t: "Sell directly to customers", d: "Reach buyers across India without any middlemen in between." },
                { Icon: IndianRupee, t: "Zero commission", d: "Keep what you earn. You set the price, you keep the value." },
                { Icon: Palette, t: "Built for handmade", d: "Made-to-order, small batches and unique pieces — all supported out of the box." },
                { Icon: ShoppingBag, t: "Government platform", d: "Backed by the Government of India. Sell with trust and official support." },
              ].map(({ Icon, t, d }) => (
                <div key={t} className="surface-card p-6 hover-lift">
                  <div className="h-11 w-11 rounded-2xl bg-[var(--cream)] grid place-items-center mb-5">
                    <Icon className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <h3 className="font-serif text-[20px] leading-[24px] font-medium">{t}</h3>
                  <p className="text-[14px] leading-[20px] text-[var(--muted-foreground)] mt-2">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-20">
            <div className="max-w-[680px]">
              <h2 className="font-serif text-[40px] leading-[48px] font-medium">
                Start in three simple steps
              </h2>
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {[
                { n: "01", t: "Create your account", d: "Sign up in minutes with your phone number and basic details." },
                { n: "02", t: "List your products", d: "Add photos, set your price, and tell the story behind each piece." },
                { n: "03", t: "Start receiving orders", d: "Get paid directly to your bank account as orders come in." },
              ].map(({ n, t, d }) => (
                <div key={n} className="rounded-2xl border border-[var(--border)] p-7 bg-[var(--cream)]/40 flex gap-5 items-start">
                  <div className="font-serif text-[32px] leading-[40px] text-[var(--primary)]/40 shrink-0">{n}</div>
                  <div>
                    <h3 className="font-serif text-[20px] leading-[24px] font-medium">{t}</h3>
                    <p className="text-[14px] leading-[20px] text-[var(--muted-foreground)] mt-2">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ARTISAN STORIES */}
        <section id="stories" className="bg-white border-y border-[var(--border)]">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-20">
            <div className="max-w-[680px]">
              <h2 className="font-serif text-[40px] leading-[48px] font-medium">
                Real makers. Real growth.
              </h2>
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {[
                { img: artisanPrinter, name: "Lalitha Devi", craft: "Mysore gold painting · Mysuru", q: "Now I have a space to show case and sell my work online and I don't have to maintain my own website." },
                { img: artisanPotter, name: "Mohammad Irfan", craft: "Saharanpur wood carving · Uttar Pradesh", q: "The website offers a made-to-order option, so I don't need to maintain inventory like on other e-commerce platforms." },
                { img: artisanPainter, name: "Priya Sharma", craft: "Sakhi Collective · West Bengal", q: "I've tried other e-commerce websites, but the 33% commission really eats into our profits. Free shipping and zero commission have been a blessing for the Sakhi collective." },
              ].map((p) => (
                <figure key={p.name} className="surface-card overflow-hidden hover-lift">
                  <img src={p.img} alt={`${p.name}, ${p.craft}`} width={640} height={640} loading="lazy" className="w-full h-64 object-cover" />
                  <figcaption className="p-6">
                    <blockquote className="font-serif text-[18px] leading-[28px] text-[var(--foreground)]">
                      "{p.q}"
                    </blockquote>
                    <div className="mt-4">
                      <div className="text-[14px] leading-[20px] font-medium">{p.name}</div>
                      <div className="text-[14px] leading-[20px] text-[var(--muted-foreground)]">{p.craft}</div>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section id="categories">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-20">
            <div className="max-w-[680px]">
              <h2 className="font-serif text-[40px] leading-[48px] font-medium">What you can sell</h2>
              <p className="mt-4 text-[16px] leading-[24px] text-[var(--muted-foreground)]">
                From handlooms to home decor — if it's handmade, it has a home here.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { img: catClothing, t: "Clothing" },
                { img: catDecor, t: "Home decor" },
                { img: catPaintings, t: "Paintings" },
                { img: catHandicraft, t: "Handmade products" },
              ].map((c) => (
                <div key={c.t} className="group relative overflow-hidden rounded-2xl border border-[var(--border)] hover-lift">
                  <img src={c.img} alt={c.t} width={800} height={800} loading="lazy" className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4">
                    <div className="text-white font-serif text-[20px] leading-[24px] font-medium">{c.t}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[var(--primary)] text-white/90">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl p-3 inline-block">
                <BrandMark size={48} />
              </div>
              <p className="mt-5 text-[14px] leading-[20px] text-white/70 max-w-xs">
                A platform empowering Indian artisans to sell directly to customers — no middlemen, no commission.
              </p>
              <div className="mt-5 flex items-center gap-3">
                {[
                  { Icon: Instagram, label: "Instagram" },
                  { Icon: Facebook, label: "Facebook" },
                  { Icon: Youtube, label: "YouTube" },
                ].map(({ Icon, label }) => (
                  <span key={label} role="button" tabIndex={0} aria-label={label} className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">
                    <Icon className="h-4 w-4" />
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {([
                [
                  { label: "About us", to: "/help" },
                  { label: "Our mission", to: "/help" },
                  { label: "Contact us", to: "/help" },
                  { label: "Sitemap", to: "/" },
                ],
                [
                  { label: "Start selling", to: "/signup" },
                  { label: "Seller onboarding", to: "/onboarding" },
                  { label: "Help center", to: "/help" },
                  { label: "FAQs", to: "/help" },
                ],
                [
                  { label: "How it works", to: "/" },
                  { label: "Payments & pricing", to: "/earnings" },
                  { label: "GST & EID guide", to: "/gst" },
                  { label: "Shipping & logistics", to: "/help" },
                ],
                [
                  { label: "Policies", to: "/help" },
                  { label: "Terms for sellers", to: "/help" },
                  { label: "Privacy policy", to: "/help" },
                  { label: "Returns & refunds", to: "/help" },
                ],
              ] as const).map((col, i) => (
                <ul key={i} className="space-y-3 text-[14px] leading-[20px] text-white/80">
                  {col.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="hover:text-white transition-colors">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 bg-black/15">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[12px] leading-[16px] text-white/60">
              © India Handmade. All rights reserved.
            </p>
            <div className="flex items-center gap-5 text-[12px] leading-[16px] text-white/60">
              <Link to="/help" className="hover:text-white transition-colors">Terms & Conditions</Link>
              <span className="text-white/20">·</span>
              <Link to="/help" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
