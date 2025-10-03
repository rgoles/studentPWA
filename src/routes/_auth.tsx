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
    <div className="m-2 h-lvh">
      <h1>Authenticated Route</h1>
      <p>This route's content is only visible to authenticated users.</p>
      <div className="bg-background border-t-secondary fixed bottom-0 left-1/2 flex w-full -translate-x-1/2 justify-center border-t p-4 md:w-fit">
        <ul className="relative flex w-fit gap-1">
          <li>
            <Link
              to="/add-hours"
              className="text-muted-foreground data-[status='active']:text-primary flex flex-col items-center rounded-2xl p-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z"></path>
              </svg>
              <span>More</span>
            </Link>
          </li>
          <li>
            <Link
              to="/hours-list"
              className="text-muted-foreground data-[status='active']:bg-secondary data-[status='active']:text-primary flex items-center rounded-2xl p-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="#000000"
                viewBox="0 0 256 256"
              >
                <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
              </svg>{" "}
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="text-muted-foreground data-[status='active']:bg-secondary data-[status='active']:text-primary flex items-center rounded-2xl p-4"
              onClick={() => {
                console.log("izlogiran si");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
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
              to="/about"
              className="text-muted-foreground data-[status='active']:text-primary flex flex-col items-center rounded-2xl p-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
              </svg>{" "}
              <span>More</span>
            </Link>
          </li>
        </ul>
      </div>
      <hr />
      <Outlet />
    </div>
  );
}
