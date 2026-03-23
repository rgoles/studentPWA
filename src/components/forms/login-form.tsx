import { useState } from "react";
import { Button, TextInput, PasswordInput } from "@mantine/core";
import { signInWithEmail } from "@/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";
import { UserLoginSchema } from "@/lib/validation";
import type { z } from "zod";
import type { UserLoginType } from "@/types";
import { Card } from "../molecules/card";
import { GalleryVerticalEnd } from "lucide-react";

export function LoginForm() {
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
    <>
      <div className="m-2 flex h-svh flex-col items-center justify-center gap-8 md:m-0">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          student.com.hr{" "}
        </a>
        <Card>
          <Card.Header>
            <h1 className="text-xl text-neutral-900">Welcome back</h1>
            <p id="login-desc" className="text-sm text-neutral-500">
              Login with your account
            </p>
          </Card.Header>

          <Card.Body>
            <div aria-live="polite" role="status" className="sr-only">
              {isLoading ? "Logging in…" : ""}
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <p id="login-help" className="sr-only">
                All fields are required.
              </p>

              <div className="grid gap-6">
                <TextInput
                  id="email"
                  variant="filled"
                  size="md"
                  placeholder="john.doe@gmail.com"
                  label="Email"
                  description="Enter your email address."
                  {...form.register("email")}
                  error={form.formState.errors.email?.message}
                />

                <PasswordInput
                  id="password"
                  variant="filled"
                  size="md"
                  placeholder="*******"
                  label="Password"
                  description="Enter your password."
                  {...form.register("password")}
                  error={form.formState.errors.password?.message}
                />

                {/*<FormField*/}
                {/*  id="email"*/}
                {/*  error={form.formState.errors.email?.message}*/}
                {/*>*/}
                {/*  <FormField.Label>Email</FormField.Label>*/}
                {/*  <FormField.Field*/}
                {/*    placeholder="john.smith@gmail.com"*/}
                {/*    {...form.register("email")}*/}
                {/*  />*/}
                {/*  <p className="text-[0.8rem] text-neutral-500">*/}
                {/*    Enter your email address.*/}
                {/*  </p>*/}
                {/*  <FormField.Error />*/}
                {/*</FormField>*/}

                {/*<FormField*/}
                {/*  id="password"*/}
                {/*  error={form.formState.errors.password?.message}*/}
                {/*>*/}
                {/*  <FormField.Label>Password</FormField.Label>*/}
                {/*  <FormField.Field*/}
                {/*    type="password"*/}
                {/*    placeholder="password"*/}
                {/*    {...form.register("password")}*/}
                {/*  />*/}
                {/*  <p className="text-[0.8rem] text-neutral-500">*/}
                {/*    Enter your password.*/}
                {/*  </p>*/}
                {/*  <FormField.Error />*/}
                {/*</FormField>*/}
                {form.formState.errors.root && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.root.message}
                  </p>
                )}
                <Button
                  size="md"
                  type="submit"
                  disabled={isLoading}
                  aria-disabled={isLoading}
                  variant="filled"
                  color="teal"
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
          </Card.Body>
          <Card.Footer>
            <div className="*:[a]:hover:text-primary text-center text-xs text-balance text-neutral-500 *:[a]:underline *:[a]:underline-offset-4">
              By clicking login, you agree to our{" "}
              <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>.
            </div>
          </Card.Footer>
        </Card>
      </div>
    </>
  );
}
