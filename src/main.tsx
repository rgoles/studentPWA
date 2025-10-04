/* eslint-disable react-refresh/only-export-components */
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { AuthProvider, useAuth } from "./auth/auth-provider";
import "./index.css";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { registerSW } from "virtual:pwa-register";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

registerSW({
  onNeedRefresh() {
    // optional: show a toast/snackbar to refresh
    // e.g., prompt user -> if they accept:
    // updateSW(true)
  },
  onOfflineReady() {
    // optional: show “App ready to work offline”
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();

  if (auth.isInitialLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <div className="border-t-foreground size-10 animate-spin rounded-full border-4 border-gray-200" />
      </div>
    );
  }

  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
}
