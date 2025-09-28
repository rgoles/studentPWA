import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { signUpNewUser } from "@/auth";
import { Link, useNavigate } from "@tanstack/react-router";
import type { AuthError } from "@supabase/supabase-js";
import { useForm, type SubmitHandler } from "react-hook-form";
import type z from "zod";
import { UserLoginSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserLoginType } from "@/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState<AuthError | null>(null);
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

    const { error } = await signUpNewUser(data.email, data.password);
    if (!error) {
      navigate({ to: "/login", replace: true });
      console.log("DATA:", data);
    } else {
      setIsLoading(false);
      setError(error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Register to your account</CardTitle>
          <CardDescription>
            Enter your email below to register to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.smith@gmail.com" {...field} />
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
                <div className="flex flex-col gap-3">
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Loading..." : "Register"}
                  </Button>
                  <Button variant="outline" className="w-full">
                    Register with Google
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      {error && (
        <div className="text-center text-xs text-balance text-red-500">
          {error.message}
        </div>
      )}
    </div>
  );
}
