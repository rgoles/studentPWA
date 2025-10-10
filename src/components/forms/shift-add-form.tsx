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
import type { NewShift } from "@/types";
import { format } from "date-fns";

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
  const [totalHours, setTotalHours] = useState<number>(0);
  const [shift, setShift] = useState<NewShift>({
    user_id: userId,
    start_time: "",
    end_time: "",
    started_at_utc: new Date(),
    ended_at_utc: new Date(),
    shift_date: new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "2-digit",
    }),
  });

  const { add } = useWorkHoursMutations();

  function convertTimeToTimestamp(timeToConvert: NewShift) {
    const [yearStr, monthStr, dayStr] = timeToConvert.shift_date.split("-");
    const [hourStr, minuteStr = "0"] = timeToConvert.start_time.split(":");

    const year = Number(yearStr);
    const monthIndex = Number(monthStr) - 1; // 0-based!
    const day = Number(dayStr);
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    const dt = new Date(year, monthIndex, day, hour, minute);

    console.log(dt);
  }

  const onSubmitFunc = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    convertTimeToTimestamp(shift);
    // const hours = calculateShiftDurationDecimal(
    //   shift.start_time,
    //   shift.end_time,
    // );

    // if (hours <= 0) {
    //   setErrorMessage("Worked Hours must be greater than 0");
    //   return;
    // }

    // setTotalHours(hours);

    if (!shift.shift_date) {
      setErrorMessage("Please choose a date");
      return;
    }

    setButtonState("loading");

    const payload: NewShift = {
      user_id: shift.user_id,
      started_at_utc: shift.started_at_utc,
      ended_at_utc: shift.ended_at_utc,
      shift_date: shift.shift_date,
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

  if (add.isPending) stateMessage = "Saving...";
  else if (add.isError) stateMessage = `Error: ${add.error.message}`;
  else if (add.isSuccess) stateMessage = "Saved successfully!";

  // const dateLabel = shift.shift_date
  //   ? shift.shift_date.toLocaleDateString(undefined, {
  //       year: "numeric",
  //       month: "short",
  //       day: "2-digit",
  //     })
  //   : "Select date";

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
                {/*<span>{dateLabel}</span>*/}
                {/* <span>{shift.shift_date}</span> */}
                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-70" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={new Date()}
                captionLayout="dropdown"
                onSelect={(date) => {
                  if (!date) return;
                  setShift((s) => ({
                    ...s,
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

      <p>Total: {totalHours ? `${totalHours}` : "00:00"}</p>
      <p>Date: {shift.shift_date ? shift.shift_date.toLocaleString() : "—"}</p>
    </div>
  );
};
