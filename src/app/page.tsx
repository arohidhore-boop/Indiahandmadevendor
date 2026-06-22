import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  IndianRupee,
  Palette,
  ShoppingBag,
} from "lucide-react";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "@/components/ih/social-icons";
import { GovBar } from "@/components/ih/gov-bar";
import { BrandMark } from "@/components/ih/brand-mark";
import { HeaderNav } from "@/components/ih/header-nav";
import { asset } from "@/lib/asset";

const WHY = [
  {
    Icon: Users,
    t: "Sell directly to customers",
    d: "Reach buyers across India without any middlemen in between.",
  },
  {
    Icon: IndianRupee,
    t: "Zero commission",
    d: "Keep what you earn. You set the price, you keep the value.",
  },
  {
    Icon: Palette,
    t: "Built for handmade",
    d: "Made-to-order, small batches and unique pieces — all supported out of the box.",
  },
  {
    Icon: ShoppingBag,
    t: "Government platform",
    d: "Backed by the Government of India. Sell with trust and official support.",
  },
];

const STEPS = [
  { n: "01", t: "Create your account", d: "Sign up in minutes with your phone number and basic details." },
  { n: "02", t: "List your products", d: "Add photos, set your price, and tell the story behind each piece." },
  { n: "03", t: "Start receiving orders", d: "Get paid directly to your bank account as orders come in." },
];

const STORIES = [
  {
    img: "/artisan-mysore.jpg",
    name: "Lalitha Devi",
    craft: "Mysore gold painting · Mysuru",
    q: "Now I have a space to showcase and sell my work online and I don't have to maintain my own website.",
  },
  {
    img: "/artisan-woodcarver.jpg",
    name: "Mohammad Irfan",
    craft: "Saharanpur wood carving · Uttar Pradesh",
    q: "The website offers a made-to-order option, so I don't need to maintain inventory like on other e-commerce platforms.",
  },
  {
    img: "/artisan-sakhi.jpg",
    name: "Priya Sharma",
    craft: "Sakhi Collective · West Bengal",
    q: "Free shipping and zero commission have been a blessing for the Sakhi collective — the 33% commissions on other platforms really ate into our profits.",
  },
];

const CATEGORIES = [
  { img: "/cat-clothing.jpg", t: "Clothing" },
  { img: "/cat-decor.jpg", t: "Home decor" },
  { img: "/cat-paintings.jpg", t: "Paintings" },
  { img: "/cat-handicraft.jpg", t: "Handmade products" },
];

const FOOTER_COLS: { label: string; href: string }[][] = [
  [
    { label: "About us", href: "/help" },
    { label: "Our mission", href: "/help" },
    { label: "Contact us", href: "/help" },
    { label: "Sitemap", href: "/" },
  ],
  [
    { label: "Start selling", href: "/signup" },
    { label: "Seller onboarding", href: "/onboarding" },
    { label: "Help center", href: "/help" },
    { label: "FAQs", href: "/help" },
  ],
  [
    { label: "How it works", href: "/" },
    { label: "Payments & pricing", href: "/earnings" },
    { label: "GST & EID guide", href: "/gst" },
    { label: "Shipping & logistics", href: "/help" },
  ],
  [
    { label: "Policies", href: "/help" },
    { label: "Terms for sellers", href: "/help" },
    { label: "Privacy policy", href: "/help" },
    { label: "Returns & refunds", href: "/help" },
  ],
];

const SOCIALS = [
  { Icon: InstagramIcon, label: "Instagram" },
  { Icon: FacebookIcon, label: "Facebook" },
  { Icon: YoutubeIcon, label: "YouTube" },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--cream)]">
      <GovBar />
      <HeaderNav />

      <main className="flex-1">
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
                <Link href="/signup" className="ih-btn ih-btn-primary hover-lift">
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
                <Image
                  src={asset("/hero-artisan.jpg")}
                  alt="Indian artisan hand-carving an ornate wooden panel"
                  width={1280}
                  height={1280}
                  priority
                  className="w-full h-[480px] lg:h-[560px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="why" className="bg-white border-y border-[var(--border)]">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-20">
            <div className="max-w-[680px]">
              <h2 className="font-serif text-[40px] leading-[48px] font-medium">
                Why artisans choose{" "}
                <em className="text-[var(--primary)] not-italic">India Handmade</em>
              </h2>
              <p className="mt-4 text-[16px] leading-[24px] text-[var(--muted-foreground)]">
                A platform built around the people who make. Keep your craft, your story, and your earnings.
              </p>
            </div>
            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {WHY.map(({ Icon, t, d }) => (
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

        <section id="how">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-20">
            <div className="max-w-[680px]">
              <h2 className="font-serif text-[40px] leading-[48px] font-medium">
                Start in three simple steps
              </h2>
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {STEPS.map(({ n, t, d }) => (
                <div
                  key={n}
                  className="rounded-2xl border border-[var(--border)] p-7 bg-[var(--cream)]/40 flex gap-5 items-start"
                >
                  <div className="font-serif text-[32px] leading-[40px] text-[var(--primary)]/40 shrink-0">
                    {n}
                  </div>
                  <div>
                    <h3 className="font-serif text-[20px] leading-[24px] font-medium">{t}</h3>
                    <p className="text-[14px] leading-[20px] text-[var(--muted-foreground)] mt-2">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="stories" className="bg-white border-y border-[var(--border)]">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-20">
            <div className="max-w-[680px]">
              <h2 className="font-serif text-[40px] leading-[48px] font-medium">
                Real makers. Real growth.
              </h2>
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {STORIES.map((p) => (
                <figure key={p.name} className="surface-card overflow-hidden hover-lift">
                  <Image
                    src={asset(p.img)}
                    alt={`${p.name}, ${p.craft}`}
                    width={640}
                    height={640}
                    className="w-full h-64 object-cover"
                  />
                  <figcaption className="p-6">
                    <blockquote className="font-serif text-[18px] leading-[28px] text-[var(--foreground)]">
                      &ldquo;{p.q}&rdquo;
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

        <section id="categories">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-20">
            <div className="max-w-[680px]">
              <h2 className="font-serif text-[40px] leading-[48px] font-medium">
                What you can sell
              </h2>
              <p className="mt-4 text-[16px] leading-[24px] text-[var(--muted-foreground)]">
                From handlooms to home decor — if it&apos;s handmade, it has a home here.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-5">
              {CATEGORIES.map((c) => (
                <div
                  key={c.t}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--border)] hover-lift"
                >
                  <Image
                    src={asset(c.img)}
                    alt={c.t}
                    width={800}
                    height={800}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4">
                    <div className="text-white font-serif text-[20px] leading-[24px] font-medium">
                      {c.t}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

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
                {SOCIALS.map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {FOOTER_COLS.map((col, i) => (
                <ul key={i} className="space-y-3 text-[14px] leading-[20px] text-white/80">
                  {col.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="hover:text-white transition-colors">
                        {link.label}
                      </Link>
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
              <Link href="/help" className="hover:text-white transition-colors">
                Terms &amp; Conditions
              </Link>
              <span className="text-white/20">·</span>
              <Link href="/help" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
