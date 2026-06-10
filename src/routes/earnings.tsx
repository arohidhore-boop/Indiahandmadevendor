import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/ih/AppShell";

export const Route = createFileRoute("/earnings")({
  head: () => ({ meta: [{ title: "Earnings — India Handmade" }] }),
  component: Earnings,
});

const months = [
  { m: "Dec", v: 12400 },
  { m: "Jan", v: 16800 },
  { m: "Feb", v: 14200 },
  { m: "Mar", v: 19500 },
  { m: "Apr", v: 22100 },
  { m: "May", v: 24560 },
];

const payouts = [
  { date: "15 May 2026", amount: 18360, status: "Paid", utr: "HDFC22894012" },
  { date: "30 Apr 2026", amount: 14820, status: "Paid", utr: "HDFC21998765" },
  { date: "15 Apr 2026", amount: 11240, status: "Paid", utr: "HDFC21443211" },
  { date: "30 Mar 2026", amount: 9870, status: "Paid", utr: "HDFC20887122" },
];

function Earnings() {
  const max = Math.max(...months.map((x) => x.v));
  return (
    <AppShell>
      <div>
        <h1 className="font-serif text-[28px] leading-[32px]">Earnings</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Track your sales and payouts.</p>
      </div>

      <div className="surface-card p-7 grid lg:grid-cols-3 gap-6">
        <div>
          <div className="text-[12px] leading-[16px] tracking-[0.5px] text-[var(--muted-foreground)]">This month</div>
          <div className="rupee font-sans" style={{ fontSize: 44 }}>₹ 24,560</div>
          <div className="text-sm text-[var(--success)] mt-1">+11% vs last month</div>
        </div>
        <div className="lg:col-span-2">
          <svg viewBox="0 0 600 200" className="w-full h-44">
            <defs>
              <linearGradient id="lg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#E8743B" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#E8743B" stopOpacity="0" />
              </linearGradient>
            </defs>
            {(() => {
              const w = 600, h = 200, pad = 24;
              const step = (w - pad * 2) / (months.length - 1);
              const pts = months.map((m, i) => [pad + step * i, h - pad - ((m.v / max) * (h - pad * 2))] as const);
              const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
              const area = `${path} L${pts[pts.length-1][0]},${h - pad} L${pts[0][0]},${h - pad} Z`;
              return (
                <>
                  <path d={area} fill="url(#lg)" />
                  <path d={path} fill="none" stroke="#E8743B" strokeWidth="2.5" strokeLinecap="round" />
                  {pts.map((p, i) => (
                    <g key={i}>
                      <circle cx={p[0]} cy={p[1]} r="4" fill="#fff" stroke="#E8743B" strokeWidth="2" />
                      <text x={p[0]} y={h - 6} textAnchor="middle" fontSize="11" fill="#7A6A5E">{months[i].m}</text>
                    </g>
                  ))}
                </>
              );
            })()}
          </svg>
        </div>
      </div>

      <div className="surface-card">
        <div className="p-6 border-b border-[var(--border)]">
          <h3 className="font-serif text-[20px] leading-[24px] font-medium">Payout history</h3>
        </div>
        <div className="grid grid-cols-[1fr_140px_120px_1fr] px-6 py-2 bg-[var(--cream)] text-[11px] leading-[16px] tracking-[0.5px] text-[var(--muted-foreground)] font-medium">
          <div>Date</div><div>Amount</div><div>Status</div><div>UTR</div>
        </div>
        <ul className="divide-y divide-[var(--border)]">
          {payouts.map((p) => (
            <li key={p.utr} className="grid grid-cols-[1fr_140px_120px_1fr] items-center px-6 py-4 text-sm">
              <div>{p.date}</div>
              <div className="rupee">₹ {p.amount.toLocaleString("en-IN")}</div>
              <div>
                <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#5A7A3E]/15 text-[#3D5A28]">{p.status}</span>
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">{p.utr}</div>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
