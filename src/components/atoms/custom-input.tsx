import React, { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

const InputContext = createContext<{ id: string; error?: string } | null>(null);

function FormField({
  id,
  error,
  children,
}: {
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <InputContext.Provider value={{ id, error }}>
      <div className="group relative space-y-2">{children}</div>
    </InputContext.Provider>
  );
}

function useFormFieldContext() {
  const ctx = useContext(InputContext);
  if (!ctx)
    throw new Error("Input subcomponents must be used inside <FormField>");
  return ctx;
}

const Field = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => {
    const { id, error } = useFormFieldContext();

    return (
      <input
        id={id}
        type={type}
        ref={ref}
        aria-invalid={!!error}
        className={cn(
          "text-secondary-foreground focus:placeholder:text-muted-foreground/60 text-md block h-12 w-full rounded-md bg-neutral-100 px-3 pt-5 pb-2 font-medium outline-none placeholder:text-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500",
          className,
        )}
        {...props}
      />
    );
  },
);
Field.displayName = "FormField.Field";

function Label({ children, className }: React.ComponentProps<"label">) {
  const { id } = useFormFieldContext();

  return (
    <label
      htmlFor={id}
      className={cn(
        "text-muted-foreground/70 group-[&:has(input:focus)]:text-ring pointer-events-none absolute top-3 left-2 text-base transition-all duration-100 ease-out group-[&:has(input:focus)]:top-1 group-[&:has(input:focus)]:scale-90 group-[&:has(input:focus)]:text-sm group-[&:has(input:not(:placeholder-shown))]:top-1 group-[&:has(input:not(:placeholder-shown))]:scale-90 group-[&:has(input:not(:placeholder-shown))]:text-sm",
        className,
      )}
    >
      {children}
    </label>
  );
}

function FieldError({ children }: { children?: React.ReactNode }) {
  const { error } = useFormFieldContext();
  if (!error && !children) return null;

  return <p className="text-md text-red-500">{error || children}</p>;
}

FormField.Field = Field;
FormField.Label = Label;
FormField.Error = FieldError;
export { FormField };
