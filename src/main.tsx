/* eslint-disable react-refresh/only-export-components */
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import {
  AuthProvider,
  type AuthContextType,
  useAuth,
} from "./auth/auth-provider";
import "./index.css";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
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
        <div className="size-10 rounded-full border-4 border-gray-200 border-t-foreground animate-spin" />
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
      <App />
    </StrictMode>
  );
}

// // Render the app
// const rootElement = document.getElementById("root")!;
// if (!rootElement.innerHTML) {
//   const root = ReactDOM.createRoot(rootElement);
//   root.render(
//     <StrictMode>
//       <AuthProvider>
//         <RouterProvider router={router} />
//       </AuthProvider>
//     </StrictMode>
//   );
// }
