import { StoreProvider } from "@/lib/store";
import { AppShell } from "@/components/ih/app-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AppShell>{children}</AppShell>
    </StoreProvider>
  );
}
