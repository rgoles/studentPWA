import {
  createFileRoute,
  Link,
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
    <div className="h-full p-2">
      <h1>Authenticated Route</h1>
      <p>This route's content is only visible to authenticated users.</p>
      <ul className="flex gap-2 py-2">
        <li>
          <Link
            to="/add-hours"
            className="hover:underline data-[status='active']:font-semibold"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className="hover:underline data-[status='active']:font-semibold"
          >
            Invoices
          </Link>
        </li>
        <li>
          <button
            type="button"
            className="hover:underline"
            onClick={() => {
              console.log("izlogiran si");
            }}
          >
            Logout
          </button>
        </li>
      </ul>
      <hr />
      <Outlet />
    </div>
  );
}
