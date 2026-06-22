import Link from "next/link";
import { GovBar } from "@/components/ih/gov-bar";
import { BrandMark } from "@/components/ih/brand-mark";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--cream)]">
      <GovBar />
      <header className="h-[72px] bg-white border-b border-[var(--border)] sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
          <BrandMark />
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[14px] leading-[20px] font-medium text-[var(--primary)] hover:underline">Sign in</Link>
            <Link href="/signup" className="ih-btn ih-btn-primary hidden sm:inline-flex">Start selling</Link>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-6 py-20 animate-fade-up">
          <h1 className="font-serif text-[44px] lg:text-[58px] leading-[1.05] text-[var(--foreground)]">
            Start selling your <em className="text-primary not-italic">handmade</em> products across India
          </h1>
          <p className="mt-5 text-[18px] leading-[28px] text-[var(--muted-foreground)] max-w-[520px] mx-auto">
            Sell directly to customers. No middlemen. No commission.
          </p>
          <div className="mt-8">
            <Link href="/signup" className="ih-btn ih-btn-primary hover-lift">Start selling</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
