import { useAuth } from "@/auth";
import { ShiftAddForm  } from "@/components/forms/shift-add-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/shifts/add")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, isInitialLoading } = useAuth();
  if (isInitialLoading) return <p>Loading…</p>;
  if (!user) return <p>You must login</p>;

  return <ShiftAddForm userId={user.id} />;
}
