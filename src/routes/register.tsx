import { RegisterForm } from "@/components/forms/register-form";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  beforeLoad: ({ context, location }) => {
    const user = context.auth?.user;
    if (user) {
      throw redirect({
        to: "/about",
        search: { redirect: location.href },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-screen items-center justify-center">
      <RegisterForm className="w-full max-w-md" />
    </div>
  );
}
