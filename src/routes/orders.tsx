import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/ih/AppShell";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Orders — India Handmade" }] }),
  component: Orders,
});

type OrderStatus = "New" | "Packed" | "Shipped" | "Delivered";
const rows: { id: string; product: string; emoji: string; buyer: string; amount: number; date: string; status: OrderStatus }[] = [
  { id: "IH-10241", product: "Hand-woven Banarasi Dupatta", emoji: "🟥", buyer: "Anjali Mehta", amount: 2400, date: "22 May", status: "New" },
  { id: "IH-10240", product: "Blue Pottery Vase Set", emoji: "🏺", buyer: "Ravi Iyer", amount: 1850, date: "22 May", status: "New" },
  { id: "IH-10239", product: "Madhubani Painting", emoji: "🎨", buyer: "Sunita Rao", amount: 3200, date: "21 May", status: "Packed" },
  { id: "IH-10238", product: "Brass Diya Set", emoji: "🪔", buyer: "Kavita Singh", amount: 980, date: "20 May", status: "Shipped" },
  { id: "IH-10237", product: "Warli Art Wall Panel", emoji: "🖼", buyer: "Meera Joshi", amount: 1600, date: "18 May", status: "Delivered" },
];

const statusStyle: Record<OrderStatus, string> = {
  New: "bg-[#3B7BB8]/10 text-[#1F4E7E]",
  Packed: "bg-[#B8702A]/10 text-[#7A4818]",
  Shipped: "bg-[#E8743B]/15 text-[#B23A2A]",
  Delivered: "bg-[#5A7A3E]/15 text-[#3D5A28]",
};

function Orders() {
  return (
    <AppShell>
      <div>
        <h1 className="font-serif text-[28px] leading-[32px]">Orders</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Manage and dispatch your orders.</p>
      </div>
      <div className="surface-card">
        <div className="grid grid-cols-[110px_1.6fr_1fr_120px_80px_140px_100px] px-6 py-2 bg-[var(--cream)] text-[11px] leading-[16px] tracking-[0.5px] text-[var(--muted-foreground)] font-medium">
          <div>Order ID</div><div>Product</div><div>Buyer</div><div>Amount</div><div>Date</div><div>Status</div><div></div>
        </div>
        <ul className="divide-y divide-[var(--border)]">
          {rows.map((r) => (
            <li key={r.id} className="grid grid-cols-[110px_1.6fr_1fr_120px_80px_140px_100px] items-center px-6 py-4 text-sm">
              <div className="text-xs">{r.id}</div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-[var(--cream)] grid place-items-center text-lg">{r.emoji}</div>
                <span className="font-medium">{r.product}</span>
              </div>
              <div>{r.buyer}</div>
              <div className="rupee">₹ {r.amount.toLocaleString("en-IN")}</div>
              <div className="text-[var(--muted-foreground)]">{r.date}</div>
              <div>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium ${statusStyle[r.status]}`}>{r.status}</span>
              </div>
              <div className="text-right">
                <button className="ih-btn ih-btn-primary">Ship</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
