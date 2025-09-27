import { useAuth } from "@/auth";
import { WorkHoursForm } from "@/components/forms/work-hours-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/add-hours")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, isInitialLoading } = useAuth();
  if (isInitialLoading) return <p>Loading…</p>;
  if (!user) return <p>You must login</p>;

  return <WorkHoursForm userId={user.id} />;
}
