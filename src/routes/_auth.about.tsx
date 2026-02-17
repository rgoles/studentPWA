import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Button } from "@/components/catalyst/button";
import { signOut } from "@/auth/index";
import { useAuth } from "@/auth";
export const Route = createFileRoute("/_auth/about")({
  component: About,
});

function About() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="p-2">
      <p>{user.id}</p>
      <p>{user.email}</p>
      <Button onClick={signOut}>Sign Out</Button>
    </div>
  );
}
