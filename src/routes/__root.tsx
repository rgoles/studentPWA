import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AuthContextType } from "@/auth/auth-provider";

export type MyRouterContext = {
  auth: AuthContextType;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      {/* <TanStackRouterDevtools position="top-right" /> */}
    </>
  ),
});
