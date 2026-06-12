import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  LayoutGrid,
  ClipboardList,
  IndianRupee,
  Sparkles,
  HelpCircle,
  LogOut,
  Bell,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { GovBar } from "./GovBar";
import { BrandMark } from "./BrandMark";
import { useIH } from "@/lib/ih-store";

const nav = [
  { to: "/post", label: "Dashboard", icon: Home },
  { to: "/products", label: "Products", icon: LayoutGrid },
  { to: "/orders", label: "Orders", icon: ClipboardList },
  { to: "/earnings", label: "Earnings", icon: IndianRupee },
  { to: "/grow", label: "Grow", icon: Sparkles },
  { to: "/help", label: "Help", icon: HelpCircle },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { seller } = useIH();

  return (
    <div className="min-h-screen w-full flex flex-col bg-[var(--cream)]">
      <GovBar />
      <header className="sticky top-0 z-30 h-[72px] bg-white border-b border-[var(--border)] flex items-center px-6 lg:px-10">
        <BrandMark />
        <div className="ml-auto flex items-center gap-5">
          <button aria-label="Notifications" className="relative h-10 w-10 grid place-items-center rounded-[8px] hover:bg-[var(--cream)]">
            <Bell className="h-5 w-5 text-[var(--foreground)]" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[var(--accent)]" />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-[var(--border)]">
            <div className="h-10 w-10 rounded-full bg-[var(--primary)] text-white grid place-items-center font-semibold text-sm">
              {seller?.initials ?? "SM"}
            </div>
            <div className="leading-tight">
              <div className="text-sm font-medium">{seller?.name ?? "Samba Sakhi"}</div>
              <div className="text-xs text-[var(--muted-foreground)]">{seller?.sellerType ?? "Producer Company"}</div>
            </div>
            <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)]" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex w-full" id="main">
        <aside
          className={`${collapsed ? "w-[88px]" : "w-[260px]"} shrink-0 relative transition-[width] duration-300 overflow-visible z-10`}
        >
          <div className={`sticky top-[72px] mt-8 mb-4 ${collapsed ? "mx-2" : "mx-4"} bg-white border border-[var(--border)] rounded-2xl shadow-[var(--shadow-soft)] min-h-[calc(100vh-120px)] flex flex-col overflow-visible`}>
            {!collapsed && (
              <div className="px-5 pt-5 pb-2 text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                Menu
              </div>
            )}
            <nav className={`${collapsed ? "px-0 pt-4" : "px-3"} flex-1 space-y-1.5`}>
              {nav.map((n) => {
                const active = pathname === n.to || (n.to === "/post" && pathname === "/post");
                const Icon = n.icon;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    title={collapsed ? n.label : undefined}
                    className={`flex items-center ${collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 px-3.5 py-2.5"} rounded-2xl text-sm transition-colors ${
                      active
                        ? "bg-[var(--primary)] text-white font-medium"
                        : "text-[var(--foreground)] hover:bg-[var(--cream)]"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    {!collapsed && <span>{n.label}</span>}
                  </Link>
                );
              })}
            </nav>
            <div className={`${collapsed ? "p-2" : "p-3"} border-t border-[var(--border)]`}>
              <Link
                to="/"
                title={collapsed ? "Log out" : undefined}
                className={`flex items-center ${collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 px-3.5 py-2.5"} rounded-2xl text-sm text-[var(--muted-foreground)] hover:bg-[var(--cream)]`}
              >
                <LogOut className="h-[18px] w-[18px]" />
                {!collapsed && <span>Log out</span>}
              </Link>
            </div>
            <button
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="absolute top-1/2 -right-4 -translate-y-1/2 z-20 h-10 w-10 rounded-[8px] bg-white border border-[var(--border)] grid place-items-center text-[var(--primary)] hover:bg-[var(--cream)] shadow-[var(--shadow-soft)]"
            >
              {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0 pl-2 pr-6 lg:pr-10 pt-8 pb-8">
          <div className="max-w-[1100px] space-y-6 animate-fade-up">{children}</div>
        </main>
      </div>

      <button
        aria-label="Chat support"
        className="fixed bottom-6 right-6 h-10 w-10 rounded-[8px] bg-[var(--primary)] text-white grid place-items-center shadow-lg hover:scale-105 transition"
      >
        <span className="font-serif text-xl">U</span>
      </button>
    </div>
  );
}

export function StatusPill({ status }: { status: "active" | "draft" | "review" | "out" }) {
  const map = {
    active: { bg: "bg-[#5A7A3E]/10", dot: "bg-[#5A7A3E]", text: "text-[#3D5A28]", label: "Active" },
    draft: { bg: "bg-[#B8702A]/10", dot: "bg-[#B8702A]", text: "text-[#7A4818]", label: "Draft" },
    review: { bg: "bg-[#3B7BB8]/10", dot: "bg-[#3B7BB8]", text: "text-[#1F4E7E]", label: "Under review" },
    out: { bg: "bg-[#B23A2A]/10", dot: "bg-[#B23A2A]", text: "text-[#7A2218]", label: "Out of stock" },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${map.bg} ${map.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${map.dot}`} />
      {map.label}
    </span>
  );
}
