import { LoginForm } from "@/components/forms/login-form";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
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
  return <LoginForm />;
}
