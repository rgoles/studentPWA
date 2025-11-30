import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { signInWithEmail } from "@/auth/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { UserLoginSchema } from "@/lib/validation";
import { FormField } from "@/components/atoms/custom-input";
import type { z } from "zod";
import type { UserLoginType } from "@/types";
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate({ from: "/login" });

  const form = useForm<z.infer<typeof UserLoginSchema>>({
    resolver: zodResolver(UserLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<UserLoginType> = async (data) => {
    setIsLoading(true);

    try {
      await signInWithEmail(data.email, data.password);

      // Success - navigate away
      await navigate({ to: "/about", replace: true });
    } catch (err: any) {
      form.setError("root", {
        type: "manual",
        message: err?.message ?? "Something went wrong",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Semantic landmark wrapping the card */}
      <section aria-labelledby="login-title">
        <Card>
          <CardHeader className="text-center">
            {/* Real heading labels the section */}
            <h1 id="login-title" className="text-xl">
              Welcome back
            </h1>
            <CardDescription id="login-desc">
              Login with your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* live region for non-blocking status updates */}
            <div aria-live="polite" role="status" className="sr-only">
              {isLoading ? "Logging in…" : ""}
            </div>
            {/* <Form {...form}> */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <p id="login-help" className="sr-only">
                All fields are required.
              </p>

              <div className="grid gap-6">
                <FormField
                  id="email"
                  error={form.formState.errors.email?.message}
                >
                  <FormField.Label>Email</FormField.Label>
                  <FormField.Field
                    placeholder="john.smith@gmail.com"
                    {...form.register("email")}
                  />
                  <p className="text-muted-foreground text-[0.8rem]">
                    Enter your email address.
                  </p>
                  <FormField.Error />
                </FormField>

                <FormField
                  id="password"
                  error={form.formState.errors.password?.message}
                >
                  <FormField.Label>Password</FormField.Label>
                  <FormField.Field
                    type="password"
                    placeholder="password"
                    {...form.register("password")}
                  />
                  <p className="text-muted-foreground text-[0.8rem]">
                    Enter your password.
                  </p>
                  <FormField.Error />
                </FormField>
                {/* Show form errors */}
                {form.formState.errors.root && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.root.message}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  aria-disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="underline underline-offset-4">
                    Register
                  </Link>
                </div>
              </div>
            </form>
            {/* </Form> */}
          </CardContent>
        </Card>
      </section>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking login, you agree to our{" "}
        <a href="/terms">Terms of Service</a> and{" "}
        <a href="/privacy">Privacy Policy</a>.
      </div>
    </div>
  );
}
