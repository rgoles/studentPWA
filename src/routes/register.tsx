import { RegisterForm } from "@/components/forms/register-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex justify-center items-center h-screen">
      <RegisterForm className="w-full max-w-md" />
    </div>
  );
}
