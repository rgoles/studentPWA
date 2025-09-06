import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { signOutFunction } from "@/auth/index";
import { auth } from "@/config/firebase";

export const Route = createFileRoute("/_auth/about")({
  component: About,
});

function About() {
  return (
    <div className="p-2">
      <p>{auth.currentUser?.uid}</p>
      <p>{auth.currentUser?.email}</p>
      <Button onClick={signOutFunction}>Sign Out</Button>
    </div>
  );
}
