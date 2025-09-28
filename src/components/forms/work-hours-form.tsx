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
import type { Shift } from "@/types";
import { supabase } from "@/config/supabase";
import { calculateShiftDurationDecimal } from "@/lib/timeUtils";

export const WorkHoursForm = ({ userId }: { userId: string }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState<Shift>({
    start_time: "00:00",
    end_time: "00:00",
    total_hours: null,
    shift_date: new Date(),
  });

  const onSubmitFunc = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const calculatedTotalHours = calculateShiftDurationDecimal(
      shift.start_time,
      shift.end_time,
    );

    if (calculatedTotalHours <= 0) {
      setErrorMessage("Worked Hours must be greater than 0");
      return;
    }

    const payload = {
      ...shift,
      total_hours: calculatedTotalHours,
      user_id: userId,
    };
    setShift((prev) => ({ ...prev, total_hours: calculatedTotalHours }));

    const { data, error } = await supabase
      .from("work_hours")
      .insert([payload])
      .select();
    console.log(data);
    if (error) setErrorMessage(error.message);
  };

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
              setShift({
                ...shift,
                start_time: e.target.value,
              })
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
                  setShift({
                    ...shift,
                    shift_date: date,
                  });
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <p>Total: {shift.total_hours ? `${shift.total_hours}` : "00:00"}</p>
      <p>Date: {shift.shift_date ? shift.shift_date.toLocaleString() : "—"}</p>
    </div>
  );
};
