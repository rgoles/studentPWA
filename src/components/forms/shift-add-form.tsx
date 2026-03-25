import { useWorkHoursMutations } from "@/hooks/use-work-hours";
import type { Shift, ShiftFormType } from "@/types";
import { convertTimeToTimestamp } from "@/lib/timeUtils";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShiftSchema } from "@/lib/validation";
import { DatePicker, TimeInput } from "@mantine/dates";
import { Button, Text } from "@mantine/core";
import type { z } from "zod";

export const ShiftAddForm = ({
  userId,
  onSuccess,
}: {
  userId: string;
  onSuccess?: () => void;
}) => {
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

      form.reset();

      if (onSuccess) onSuccess();
    } catch (err: any) {
      form.setError("root", {
        type: "manual",
        message: err?.message ?? "Something went wrong",
      });
    }
  };

  return (
    <form
      className="flex w-screen max-w-full flex-col gap-2.5 md:w-xs"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <TimeInput
        id="shiftStart"
        label="Shift start"
        description="Input description"
        {...form.register("start_shift")}
        error={form.formState.errors.start_shift?.message}
      />
      <TimeInput
        id="shiftEnd"
        label="Shift end"
        description="Input description"
        {...form.register("end_shift")}
        error={form.formState.errors.end_shift?.message}
      />
      <div className="flex w-full justify-center py-4">
        <DatePicker
          value={form.watch("shift_date")}
          onChange={(date) => {
            if (!date) return;

            form.setValue("shift_date", new Date(date), {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        />
      </div>

      {form.formState.errors.root && (
        <Text size="sm" c="red">
          {form.formState.errors.root.message}
        </Text>
      )}

      <Button size="md" type="submit" variant="filled" color="blue.8" fullWidth>
        Add Shift
      </Button>
    </form>
  );
};
