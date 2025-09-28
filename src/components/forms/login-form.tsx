import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signInWithEmail } from "@/auth/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import type { AuthError } from "@supabase/supabase-js";
import { useForm, type SubmitHandler } from "react-hook-form";
import { UserLoginSchema } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import type { z } from "zod";
import type { UserLoginType } from "@/types";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
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
    const { error } = await signInWithEmail(data.email, data.password);

    if (!error) {
      await navigate({ to: "/about", replace: true });
    } else {
      setError(error);
      setIsLoading(false);
      console.error(error);
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <p id="login-help" className="sr-only">
                  All fields are required.
                </p>

                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john.smith@gmail.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter your email address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />{" "}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Enter your password.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />{" "}
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
                    <Link
                      to="/register"
                      className="underline underline-offset-4"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
            {/* Global error summary */}
            {error && (
              <div
                tabIndex={-1}
                role="alert"
                aria-live="assertive"
                className="mt-4 text-center text-xs text-balance text-red-600"
              >
                {error.message}
              </div>
            )}
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
