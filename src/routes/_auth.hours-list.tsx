import { HoursListScreen } from "@/components/screens/hours-list-screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/hours-list")({
  component: RouteComponent,
});

function RouteComponent() {
  return <HoursListScreen />;
}
