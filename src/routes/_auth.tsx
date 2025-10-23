import PwaLayout from "@/components/layout/default-layout";
import {
  ListIcon,
  UserIcon,
} from "@phosphor-icons/react";
import {
  createFileRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isSignedIn) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
    console.log("User authenticated, proceeding...");
  },
  component: AuthLayout,
});

export function AuthLayout() {

  return (
    <PwaLayout
      items={[
        { to: "/shifts/list", label: "Shift", icon: ListIcon },
        { to: "/about", label: "Profile", icon: UserIcon },
      ]}
    >
      <Outlet />
    </PwaLayout>
  );
}
