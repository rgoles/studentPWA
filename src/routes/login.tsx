import { LoginForm } from "@/components/forms/login-form";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context, location }) => {
    const user = context.auth?.user;
    if (user) {
      throw redirect({
        to: "/about",
        search: { redirect: location.href },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-[90dvh] flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          student.com.hr{" "}
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
