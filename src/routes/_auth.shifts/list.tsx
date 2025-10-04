import { useAuth } from "@/auth";
import {
  ShiftsListScreen,
} from "@/components/screens/shifts-list-screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/shifts/list")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, isInitialLoading } = useAuth();
  if (isInitialLoading) return <p>Loading…</p>;
  if (!user) return <p>You must login</p>;

  return <ShiftsListScreen />;
}
