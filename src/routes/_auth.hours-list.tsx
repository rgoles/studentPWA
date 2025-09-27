import { useAuth } from "@/auth";
import { HoursListScreen } from "@/components/screens/hours-list-screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/hours-list")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, isInitialLoading } = useAuth();
  if (isInitialLoading) return <p>Loading…</p>;
  if (!user) return <p>You must login</p>;

  return <HoursListScreen userId={user.id} />;
}
