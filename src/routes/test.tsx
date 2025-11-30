import { FormField } from "@/components/atoms/custom-input";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  const nameRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    email: "",
    name: "",
  });

  return (
    <div className="flex w-screen flex-col items-center space-y-4 p-4">
      <form
        className="flex h-screen w-72 flex-col justify-center gap-4 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Submitted:", form);
        }}
      >
        <FormField id="name" error={undefined}>
          <FormField.Label>Name</FormField.Label>
          <FormField.Field
            type="text"
            placeholder="John Doe"
            ref={nameRef}
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <FormField.Error />
        </FormField>

        <FormField id="email" error={undefined}>
          <FormField.Label>Email</FormField.Label>
          <FormField.Field
            type="text"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <FormField.Error />
        </FormField>

        <Button onClick={() => nameRef.current?.focus()} type="submit">
          Submit
        </Button>
      </form>

      <p>Thank you for your submission!</p>
      <p>Your input has been recorded.</p>
    </div>
  );
}
