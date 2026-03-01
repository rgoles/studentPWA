import { cn } from "@/lib/utils";
import { Button } from "@/components/catalyst/button";
import { useState } from "react";
import { signUpNewUser } from "@/auth";
import { Link, useNavigate } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";
import type z from "zod";
import { UserLoginSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserLoginType } from "@/types";
import { FormField } from "../atoms/custom-input";
import { Card } from "../molecules/card";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate({ from: "/register" });

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
      await signUpNewUser(data.email, data.password);

      // Success - navigate to login
      navigate({ to: "/login", replace: true });
    } catch (err: any) {
      form.setError("root", {
        type: "manual",
        message: err?.message ?? "Something went wrong",
      });
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "m-2 flex h-svh w-full flex-col items-center justify-center gap-8 md:m-0",
        className,
      )}
      {...props}
    >
      <Card>
        <Card.Header>
          <h1 className="text-xl text-neutral-900">Welcome</h1>
          <p className="text-sm text-neutral-500">Register your account</p>
        </Card.Header>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card.Body className="flex flex-col gap-6">
            <FormField id="email" error={form.formState.errors.email?.message}>
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
                placeholder="john.smith@gmail.com"
                {...form.register("password")}
              />
              <p className="text-muted-foreground text-[0.8rem]">
                Enter your password.
              </p>
              <FormField.Error />
            </FormField>
            {form.formState.errors.root && (
              <p className="text-sm text-red-600">
                {form.formState.errors.root.message}
              </p>
            )}
          </Card.Body>
          <Card.Footer>
            <div className="flex flex-col gap-3">
              <Button
                color="emerald"
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Loading..." : "Register"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </Card.Footer>
        </form>
      </Card>
    </div>
  );
}
