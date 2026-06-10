import { createFileRoute } from "@tanstack/react-router";
import { Star, MessageCircle, Award, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/ih/AppShell";

export const Route = createFileRoute("/grow")({
  head: () => ({ meta: [{ title: "Grow — India Handmade" }] }),
  component: Grow,
});

const cards = [
  {
    icon: Star,
    title: "Get your first 5-star review",
    body: "Buyers trust shops with reviews. Ask happy customers to leave one — most will say yes.",
    tag: "Trust",
  },
  {
    icon: MessageCircle,
    title: "Promote on WhatsApp",
    body: "Share your product link directly with friends, family, and existing customers. Most sales start here.",
    tag: "Marketing",
  },
  {
    icon: Award,
    title: "Apply for Ministry of Textiles recognition",
    body: "Recognition badges boost trust and unlock visibility on India Handmade's homepage.",
    tag: "Recognition",
  },
];

function Grow() {
  return (
    <AppShell>
      <div>
        <h1 className="font-serif text-[26px]">Grow your shop</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Tips & resources to take your craft further.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <article key={c.title} className="surface-card p-6 flex flex-col hover-lift">
              <div className="h-32 rounded-xl bg-gradient-to-br from-[var(--cream)] to-[var(--secondary)] grid place-items-center">
                <Icon className="h-10 w-10 text-[var(--primary)]" />
              </div>
              <span className="mt-4 text-[11px] uppercase tracking-wider text-[var(--accent)] font-medium">{c.tag}</span>
              <h3 className="font-serif text-xl mt-1 leading-tight">{c.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)] mt-2 flex-1">{c.body}</p>
              <a className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--primary)] font-medium hover:gap-2.5 transition-all">
                Read more <ArrowRight className="h-4 w-4" />
              </a>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
