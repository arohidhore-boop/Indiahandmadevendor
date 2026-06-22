"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { StatusPill } from "@/components/ih/app-shell";
import { useStore } from "@/lib/store";

const filters = ["All", "Active", "Draft", "Under review", "Out of stock"] as const;

export default function Products() {
  const { products } = useStore();
  const [f, setF] = useState<(typeof filters)[number]>("All");
  const [q, setQ] = useState("");

  const list = products.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (f === "All") return true;
    if (f === "Active") return p.status === "active";
    if (f === "Draft") return p.status === "draft";
    if (f === "Under review") return p.status === "review";
    if (f === "Out of stock") return p.status === "out" || p.stock === 0 || p.stock === undefined;
    return true;
  });

  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-[28px] leading-[32px]">All products</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Manage your full catalogue.</p>
        </div>
        <Link href="/add-product" className="ih-btn ih-btn-primary">
          <Plus className="h-4 w-4" /> Add product
        </Link>
      </div>

      <div className="surface-card p-5 flex flex-wrap items-center gap-3">
        {filters.map((x) => (
          <button
            key={x}
            onClick={() => setF(x)}
            className={`ih-btn ${
              f === x
                ? "ih-btn-primary"
                : "ih-btn-ghost border-[var(--border)] hover:border-[var(--primary)]/40"
            }`}
          >
            {x}
          </button>
        ))}
        <div className="ml-auto relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="pl-9 pr-3 py-2 rounded-[10px] border border-[var(--border)] bg-white text-sm outline-none focus:border-[var(--primary)] w-64" />
        </div>
      </div>

      <div className="surface-card">
        <div className="grid grid-cols-[1.7fr_120px_90px_140px_80px] px-6 py-2 bg-[var(--cream)] text-[11px] leading-[16px] tracking-[0.5px] text-[var(--muted-foreground)] font-medium">
          <div>Product</div><div>Price</div><div>Stock</div><div>Status</div><div></div>
        </div>
        <ul className="divide-y divide-[var(--border)]">
          {list.map((p) => (
            <li key={p.id} className="grid grid-cols-[1.7fr_120px_90px_140px_80px] items-center px-6 py-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[var(--cream)] grid place-items-center text-xl shrink-0 overflow-hidden">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    p.emoji ?? "📦"
                  )}
                </div>
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">{p.category}{p.subCategory ? ` · ${p.subCategory}` : ""}</div>
                </div>
              </div>
              <div className="rupee">₹ {p.price.toLocaleString("en-IN")}</div>
              <div>{typeof p.stock === "number" ? `${p.stock} units` : "—"}</div>
              <div><StatusPill status={p.status} /></div>
              <div className="text-right">
                <button className="ih-btn ih-btn-ghost text-[var(--primary)]">
                  {p.status === "draft" ? "Continue" : p.status === "review" ? "View" : "Edit"}
                </button>
              </div>
            </li>
          ))}
          {list.length === 0 && (
            <li className="p-12 text-center text-[var(--muted-foreground)]">No products match your filters.</li>
          )}
        </ul>
      </div>
    </>
  );
}
