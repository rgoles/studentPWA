import PwaLayout from "@/components/layout/default-layout";
import {
  CalendarIcon,
  ListIcon,
  PlaceholderIcon,
  UserIcon,
} from "@phosphor-icons/react";
import {
  createFileRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context, location }) => {
    // Check if user is authenticated
    if (!context.auth.isSignedIn) {
      console.log("User not authenticated, redirecting to login...");
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
  // const router = useRouter();
  // const navigate = Route.useNavigate();
  // const auth = useAuth();

  // istrazit kod
  // const handleLogout = () => {
  //   if (window.confirm('Are you sure you want to logout?')) {
  //     auth.logout().then(() => {
  //       router.invalidate().finally(() => {
  //         navigate({ to: '/login' })
  //       })
  //     })
  //   }
  // }

  return (
    <PwaLayout
      items={[
        { to: "/shifts/add", label: "New Shift", icon: CalendarIcon },
        { to: "/shifts/list", label: "Shift", icon: ListIcon },
        { to: "/", label: "Unknown", icon: PlaceholderIcon },
        { to: "/about", label: "Profile", icon: UserIcon },
      ]}
    >
      <Outlet />
    </PwaLayout>
  );
}
