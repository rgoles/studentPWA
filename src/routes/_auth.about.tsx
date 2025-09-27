import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth/index";
import { useAuth } from "@/auth";
export const Route = createFileRoute("/_auth/about")({
  component: About,
});

function About() {
  const { user } = useAuth();
  if (!user) {
    return <p>Login please</p>;
  }

  return (
    <div className="p-2">
      <p>{user.id}</p>
      <p>{user.email}</p>
      <Button onClick={signOut}>Sign Out</Button>
    </div>
  );
}
