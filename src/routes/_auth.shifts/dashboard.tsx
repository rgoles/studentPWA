import { useAuth } from "@/auth";
import { ShiftsDashboardScreen } from "@/components/screens/shifts-dashboard-screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/shifts/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, isInitialLoading } = useAuth();
  if (isInitialLoading) return <p>Loading…</p>;
  if (!user) return <p>You must login</p>;
  return <ShiftsDashboardScreen />;
}
