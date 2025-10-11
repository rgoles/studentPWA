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
import { useWorkHoursMutations } from "@/hooks/use-work-hours";
import { AnimatePresence, motion } from "motion/react";
import { format } from "date-fns";
import type { Shift } from "@/types";
import { convertTimeToTimestamp } from "@/lib/timeUtils.ts";

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
  onSuccess: any;
}) => {
  let stateMessage = "";
  const [buttonState, setButtonState] =
    useState<keyof typeof buttonCopy>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);

  const [shift, setShift] = useState<Shift>({
    user_id: userId,
    start_shift: "00:00",
    end_shift: "00:00",
    started_at_utc: new Date(),
    ended_at_utc: new Date(),
    shift_date: new Date(),
  });

  const { add } = useWorkHoursMutations();

  const onSubmitFunc = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const { started_at_utc, ended_at_utc } = convertTimeToTimestamp(shift);

    if (!shift.shift_date) {
      setErrorMessage("Please choose a date");
      return;
    }

    setButtonState("loading");

    const payload: Shift = {
      user_id: shift.user_id,
      started_at_utc: started_at_utc,
      ended_at_utc: ended_at_utc,
    };

    try {
      await add.mutateAsync(payload);
      setButtonState("success");
      if (onSuccess) onSuccess();
      setTimeout(() => setButtonState("idle"), 1500);
    } catch (err: any) {
      setErrorMessage(err?.message ?? "Something went wrong");
      setButtonState("idle");
    }
  };

  if (add.isPending) stateMessage = "Saving...";
  else if (add.isError) stateMessage = `Error: ${add.error.message}`;
  else if (add.isSuccess) stateMessage = "Saved successfully!";

  const dateLabel = shift.shift_date
    ? format(shift.shift_date, "PPP")
    : "Select date";

  return (
    <>
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
            value={shift.start_shift}
            onChange={(e) =>
              setShift((s) => ({
                ...s,
                start_shift: e.target.value,
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
            value={shift.end_shift}
            onChange={(e) =>
              setShift((s) => ({
                ...s,
                end_shift: e.target.value,
              }))
            }
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="date-picker" className="px-1">
            Datum kraja smjene
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
                selected={shift.shift_date}
                captionLayout="dropdown"
                onSelect={(date) => {
                  if (!date) return;
                  setShift((p) => ({
                    ...p,
                    shift_date: date,
                  }));
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button className="w-full" type="submit" asChild>
          <button className="blue-button" disabled={buttonState === "loading"}>
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

      <p>Date: {shift.shift_date ? shift.shift_date.toLocaleString() : "—"}</p>
    </>
  );
};
