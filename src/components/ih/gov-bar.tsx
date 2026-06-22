"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Accessibility, ChevronDown, Eye } from "lucide-react";
import { asset } from "@/lib/asset";

export function GovBar() {
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [hc, setHc] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const px = size === "sm" ? "14px" : size === "lg" ? "18px" : "16px";
    root.style.fontSize = px;
  }, [size]);

  useEffect(() => {
    document.documentElement.classList.toggle("hc", hc);
  }, [hc]);

  return (
    <div className="h-10 w-full bg-[var(--gov)] text-white text-[12px]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 h-full flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Image src={asset("/flag.png")} alt="Flag of India" width={24} height={16} className="h-4 w-6 object-contain" />
        <span className="font-medium tracking-wide">Government of India</span>
      </div>
      <div className="ml-auto flex items-center text-white/90 divide-x divide-white/20">
        <a href="#main" className="hover:underline hidden md:inline px-4">Skip to Main Content</a>
        <button className="hidden md:inline-flex items-center gap-1.5 hover:underline px-4">
          <Eye className="h-3.5 w-3.5" /> Screen Reader
        </button>
        <div className="inline-flex items-center gap-1 px-4">
          <button onClick={() => setSize("sm")} aria-label="Smaller text" className={`h-5 w-5 grid place-items-center rounded text-[11px] ${size === "sm" ? "bg-white/20" : "hover:bg-white/10"}`}>A⁻</button>
          <button onClick={() => setSize("md")} aria-label="Normal text" className={`h-5 w-5 grid place-items-center rounded text-[12px] ${size === "md" ? "bg-white/20" : "hover:bg-white/10"}`}>A</button>
          <button onClick={() => setSize("lg")} aria-label="Larger text" className={`h-5 w-5 grid place-items-center rounded text-[13px] ${size === "lg" ? "bg-white/20" : "hover:bg-white/10"}`}>A⁺</button>
        </div>
        <div className="px-4">
          <button onClick={() => setHc((v) => !v)} aria-label="Toggle contrast" className={`h-4 w-4 rounded-full border border-white/70 relative overflow-hidden ${hc ? "bg-white" : ""}`}>
            <span className="absolute inset-y-0 left-0 w-1/2 bg-white" />
          </button>
        </div>
        <button className="hidden md:inline-flex items-center gap-1.5 hover:underline px-4">
          <span className="inline-block h-3.5 w-3.5 rounded-full border border-white/70" /> English <ChevronDown className="h-3 w-3" />
        </button>
        <button className="hidden md:inline-flex items-center gap-1.5 hover:underline pl-4">
          <Accessibility className="h-3.5 w-3.5" /> More
        </button>
      </div>
      </div>
    </div>
  );
}
