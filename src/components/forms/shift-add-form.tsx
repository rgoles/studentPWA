import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { calculateShiftDurationDecimal } from "@/lib/timeUtils";
import { useWorkHoursMutations } from "@/hooks/use-work-hours";
import { AnimatePresence, motion } from "motion/react";
import type { ShiftPayload, ShiftUIState } from "@/types";
import { toYMD } from "@/lib/dateOnly";
const buttonCopy = {
  idle: "Add Shift",
  loading: "Loading...",
  success: "Shift Added",
} as const;

export const ShiftAddForm = ({ userId }: { userId: string }) => {
  let stateMessage = "";
  const [buttonState, setButtonState] =
    useState<keyof typeof buttonCopy>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState<ShiftUIState>({
    start_time: "00:00",
    end_time: "00:00",
    total_hours: null,
    shift_date: new Date(),
  });

  const { add } = useWorkHoursMutations();

  const onSubmitFunc = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const hours = calculateShiftDurationDecimal(
      shift.start_time,
      shift.end_time,
    );

    if (hours <= 0) {
      setErrorMessage("Worked Hours must be greater than 0");
      return;
    }

    if (!shift.shift_date) {
      setErrorMessage("Please choose a date");
      return;
    }

    setButtonState("loading");

    const payload: ShiftPayload = {
      user_id: userId,
      start_time: shift.start_time,
      end_time: shift.end_time,
      total_hours: hours,
      shift_date: toYMD(shift.shift_date),
    };

    try {
      await add.mutateAsync(payload);
      setButtonState("success");
      setTimeout(() => setButtonState("idle"), 1500);
    } catch (err: any) {
      setErrorMessage(err?.message ?? "Something went wrong");
      setButtonState("idle");
    }
  };

  // if (add.isPending) stateMessage = "Saving...";
  // else if (add.isError) stateMessage = `Error: ${add.error.message}`;
  // else if (add.isSuccess) stateMessage = "Saved successfully!";

  const dateLabel = shift.shift_date
    ? shift.shift_date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    : "Select date";

  return (
    <div className="mt-5">
      <form
        className="flex w-screen max-w-full flex-col gap-2.5 md:w-xs"
        onSubmit={onSubmitFunc}
      >
        <div className="space-y-2">
          <Label htmlFor="shiftStart">Shift Start</Label>
          <Input
            type="time"
            placeholder="Shift Start"
            name="shiftStart"
            className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            value={shift.start_time}
            onChange={(e) =>
              setShift((s) => ({
                ...s,
                start_time: e.target.value,
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shiftEnd">Shift End</Label>
          <Input
            type="time"
            placeholder="Shift End"
            className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            name="shiftEnd"
            value={shift.end_time}
            onChange={(e) =>
              setShift({
                ...shift,
                end_time: e.target.value,
              })
            }
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="date-picker" className="px-1">
            Date
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker"
                className="justify-between font-normal"
              >
                <span>{dateLabel}</span>
                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-70" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={shift.shift_date || undefined}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setShift((s) => ({ ...s, shift_date: date ?? null }));
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button className="w-full" type="submit" asChild>
          <button
            className="blue-button"
            disabled={buttonState === "loading"} // or: disabled={add.isPending}
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
          </button>
        </Button>
      </form>
      <p>{stateMessage}</p>
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <p>Total: {shift.total_hours ? `${shift.total_hours}` : "00:00"}</p>
      <p>Date: {shift.shift_date ? shift.shift_date.toLocaleString() : "—"}</p>
    </div>
  );
};
