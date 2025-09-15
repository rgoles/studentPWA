import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { AlarmClockPlus, List, UserPen } from "lucide-react";

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
      <div className="fixed bottom-0 left-1/2 flex w-full -translate-x-1/2 justify-center p-4 backdrop-blur-sm">
        <ul className="relative flex w-fit gap-1 rounded-[20px] bg-blue-400/45 p-1 ring-1 ring-black/5 backdrop-blur supports-[backdrop-filter]:bg-blue-400/45">
          <li className="">
            <Link
              to="/add-hours"
              className="bg-secondary text-muted-foreground data-[status='active']:bg-primary data-[status='active']:text-background flex items-center rounded-2xl p-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <g fill="none">
                  <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                  <path
                    fill="currentColor"
                    d="M7 4a1 1 0 0 1 2 0v1h6V4a1 1 0 1 1 2 0v1h2a2 2 0 0 1 2 2v3H3V7a2 2 0 0 1 2-2h2zm11 10a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2a1 1 0 0 1 1-1m0-2a3 3 0 0 0-2.836 2.018a1.9 1.9 0 0 1-1.146 1.146a3.001 3.001 0 0 0-.174 5.605l.174.067q.18.063.346.164H5a2 2 0 0 1-2-2v-7z"
                  />
                </g>
              </svg>
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="bg-secondary text-muted-foreground data-[status='active']:bg-primary data-[status='active']:text-background flex items-center rounded-2xl p-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <g fill="none">
                  <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                  <path
                    fill="currentColor"
                    d="M20 17.5a1.5 1.5 0 0 1 0 3H9a1.5 1.5 0 0 1 0-3zm-15.5 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m15.5-7a1.5 1.5 0 0 1 .144 2.993L20 13.5H9a1.5 1.5 0 0 1-.144-2.993L9 10.5zm-15.5 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m0-7a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m15.5 0a1.5 1.5 0 0 1 .144 2.993L20 6.5H9a1.5 1.5 0 0 1-.144-2.993L9 3.5z"
                  />
                </g>
              </svg>
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="bg-secondary text-muted-foreground data-[status='active']:bg-primary data-[status='active']:text-background flex items-center rounded-2xl p-4"
              onClick={() => {
                console.log("izlogiran si");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <g fill="none">
                  <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                  <path
                    fill="currentColor"
                    d="M11 2a5 5 0 1 0 0 10a5 5 0 0 0 0-10m0 11q.887.002 1.724.12a1 1 0 0 1 .539 1.726a6.98 6.98 0 0 0-2.21 6.022a1 1 0 0 1-1.012 1.123c-2.01-.04-3.89-.216-5.294-.646c-.702-.215-1.364-.517-1.866-.962C2.35 19.913 2 19.28 2 18.5c0-.787.358-1.523.844-2.139c.494-.625 1.177-1.2 1.978-1.69C6.425 13.695 8.605 13 11 13m10.212 1.034a2.5 2.5 0 0 1 0 3.535l-3.418 3.418a1.5 1.5 0 0 1-.848.424l-2.309.33a1 1 0 0 1-1.132-1.133l.33-2.308a1.5 1.5 0 0 1 .424-.849l3.418-3.418a2.5 2.5 0 0 1 3.535 0Z"
                  />
                </g>
              </svg>
            </button>
          </li>

          <li>
            <Link
              to="/hours-list"
              className="bg-secondary text-muted-foreground data-[status='active']:bg-primary data-[status='active']:text-background flex items-center rounded-2xl p-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M12 2.5A1.5 1.5 0 0 1 13.5 4v5.402L18.178 6.7a1.5 1.5 0 0 1 1.5 2.598L15 12l4.678 2.701a1.5 1.5 0 0 1-1.5 2.598l-4.678-2.7V20a1.5 1.5 0 0 1-3 0v-5.402L5.822 17.3a1.5 1.5 0 1 1-1.5-2.598L9 12L4.322 9.299a1.5 1.5 0 0 1 1.5-2.598l4.678 2.7V4A1.5 1.5 0 0 1 12 2.5" /></g></svg>
            </Link>
          </li>
        </ul>
      </div>
      <hr />
      <Outlet />
    </div>
  );
}
