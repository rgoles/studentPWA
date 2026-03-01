import { useState } from "react";
import { Button } from "@/components/catalyst/button";
import { useWorkHoursMutations } from "@/hooks/use-work-hours";
import { AnimatePresence, motion } from "motion/react";
import type { Shift, ShiftFormType } from "@/types";
import { convertTimeToTimestamp } from "@/lib/timeUtils";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShiftSchema } from "@/lib/validation";

import type { z } from "zod";
import { FormField } from "@/components/atoms/custom-input.tsx";
import { DatePickerField } from "@/components/atoms/date-picker-field.tsx";

const buttonCopy = {
  idle: "Add Shift",
  loading: "Loading...",
  success: "Shift Added",
} as const;

export const ShiftAddForm = ({
  userId,
  onSuccess,
}: {
  userId: string;
  onSuccess?: () => void;
}) => {
  const [buttonState, setButtonState] =
    useState<keyof typeof buttonCopy>("idle");
  const [open, setOpen] = useState(false);

  const { add } = useWorkHoursMutations();

  const form = useForm<z.infer<typeof ShiftSchema>>({
    resolver: zodResolver(ShiftSchema),
    defaultValues: {
      start_shift: "07:00",
      end_shift: "15:00",
      shift_date: new Date(),
    },
  });

  const handleSubmit: SubmitHandler<ShiftFormType> = async (data) => {
    setButtonState("loading");

    try {
      const tempShift: Shift = {
        user_id: userId,
        start_shift: data.start_shift,
        end_shift: data.end_shift,
        shift_date: data.shift_date,
        started_at_utc: new Date(),
        ended_at_utc: new Date(),
      };

      const { started_at_utc, ended_at_utc } =
        convertTimeToTimestamp(tempShift);

      const payload: Shift = {
        user_id: userId,
        started_at_utc,
        ended_at_utc,
      };

      await add.mutateAsync(payload);
      setButtonState("success");

      // Reset form after successful submission
      form.reset();

      if (onSuccess) onSuccess();
      setTimeout(() => setButtonState("idle"), 1500);
    } catch (err: any) {
      form.setError("root", {
        type: "manual",
        message: err?.message ?? "Something went wrong",
      });
      setButtonState("idle");
    }
  };

  const watchedDate = form.watch("shift_date");
  const dateLabel = watchedDate
    ? watchedDate.toLocaleDateString("hr-HR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })
    : "Select date";

  return (
    <form
      className="flex w-screen max-w-full flex-col gap-2.5 md:w-xs"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <FormField
        id="shiftStart"
        error={form.formState.errors.start_shift?.message}
      >
        <FormField.Label>Start Shift</FormField.Label>
        <FormField.Field
          placeholder="Shift Start"
          type={"time"}
          className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          {...form.register("start_shift")}
        />
        <p className="text-[0.8rem] text-neutral-500">Enter your shift start</p>
        <FormField.Error />
      </FormField>

      <FormField id="shiftEnd" error={form.formState.errors.end_shift?.message}>
        <FormField.Label>End Shift</FormField.Label>
        <FormField.Field
          className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          type="time"
          placeholder="End Start"
          {...form.register("end_shift")}
        />
        <p className="text-[0.8rem] text-neutral-500">Enter your shift end</p>
        <FormField.Error />
      </FormField>

      <DatePickerField
        label="Datum kraja smjene"
        value={form.watch("shift_date")}
        onChange={(date) =>
          form.setValue("shift_date", date, { shouldValidate: true })
        }
        error={form.formState.errors.shift_date?.message}
      />

      {form.formState.errors.root && (
        <p className="text-sm text-red-600">
          {form.formState.errors.root.message}
        </p>
      )}

      <Button
        color={"emerald"}
        className="w-full"
        type="submit"
        disabled={buttonState === "loading"}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={buttonState}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            initial={{ y: -25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 25, opacity: 0 }}
          >
            {buttonCopy[buttonState]}
          </motion.span>
        </AnimatePresence>
      </Button>
    </form>
  );
};
