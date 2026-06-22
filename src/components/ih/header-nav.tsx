"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/ih/brand-mark";

export function HeaderNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="h-[72px] bg-white border-b border-[var(--border)] sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
          <BrandMark />
          <button
            onClick={() => setOpen((o) => !o)}
            className="sm:hidden h-9 w-9 rounded-lg border border-[var(--border)] flex items-center justify-center bg-white"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="text-[14px] leading-[20px] font-medium text-[var(--primary)] hover:underline"
            >
              Sign in
            </Link>
            <Link href="/signup" className="ih-btn ih-btn-primary">
              Start selling
            </Link>
          </div>
        </div>
      </header>
      {open && (
        <div className="sm:hidden bg-white border-b border-[var(--border)] px-6 py-4 space-y-3 animate-fade-up">
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="block text-[14px] font-medium text-[var(--foreground)] hover:text-[var(--primary)]"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            onClick={() => setOpen(false)}
            className="ih-btn ih-btn-primary w-full justify-center"
          >
            Start selling
          </Link>
        </div>
      )}
    </>
  );
}
