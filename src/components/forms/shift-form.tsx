import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { useWorkHoursMutations } from "@/hooks/use-work-hours";
import { AnimatePresence, motion } from "motion/react";
import type { Shift, ShiftFormType } from "@/types";
import { convertTimeToTimestamp } from "@/lib/timeUtils";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShiftSchema } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { z } from "zod";

const buttonCopy = {
  idle: "Add Shift",
  loading: "Loading...",
  success: "Shift Added",
} as const;

export const ShiftForm = ({
  userId,
  onSuccess,
  formMode,
  shiftData,
}: {
  userId: string;
  onSuccess?: () => void;
  formMode: "add" | "edit";
  shiftData?: Shift;
}) => {
  const [buttonState, setButtonState] =
    useState<keyof typeof buttonCopy>("idle");
  const [open, setOpen] = useState(false);

  const { add, edit } = useWorkHoursMutations();

  // const form = useForm<z.infer<typeof ShiftSchema>>({
  //   resolver: zodResolver(ShiftSchema),
  //   defaultValues:
  //     formMode === "add"
  //       ? {
  //           start_shift: "07:00",
  //           end_shift: "15:00",
  //           shift_date: new Date(),
  //         }
  //       : {
  //           start_shift: shiftData?.start_shift || "",
  //           end_shift: shiftData?.end_shift || "",
  //           shift_date: shiftData?.shift_date || new Date(),
  //         },
  // });

  const toTimeInput = (value: string | Date) => {
    const d = new Date(value);
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const form = useForm<z.infer<typeof ShiftSchema>>({
    resolver: zodResolver(ShiftSchema),
    defaultValues: {
      start_shift: "07:00",
      end_shift: "15:00",
      shift_date: new Date(),
    },
  });

  useEffect(() => {
    if (formMode === "edit" && shiftData) {
      form.reset({
        start_shift: toTimeInput(shiftData.started_at_utc),
        end_shift: toTimeInput(shiftData.ended_at_utc),
        shift_date: new Date(shiftData.ended_at_utc),
      });
    }
  }, [formMode, shiftData, form]);

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

      if (formMode === "edit" && shiftData?.id) {
        payload.id = shiftData.id;
        await edit.mutateAsync(payload);
        console.log("Edited shift with ID:", payload.id, "data:", payload);
      } else {
        await add.mutateAsync(payload);
      }

      setButtonState("success");

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
    <Form {...form}>
      <form
        className="flex w-screen max-w-full flex-col gap-2.5 md:w-xs"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="start_shift"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shift Start</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  placeholder="Shift Start"
                  className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_shift"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shift End</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  placeholder="Shift End"
                  className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shift_date"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2">
              <FormLabel className="px-1">Datum kraja smjene</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="justify-between font-normal"
                    >
                      <span>{dateLabel}</span>
                      <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-70" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      if (!date) return;
                      field.onChange(date);
                      console.info(date);
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm text-red-600">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button
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
    </Form>
  );
};
