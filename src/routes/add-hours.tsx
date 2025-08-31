import { WorkHoursForm } from "@/components/forms/work-hours-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/add-hours")({
  component: RouteComponent,
});

function RouteComponent() {
  return <WorkHoursForm />;
}
