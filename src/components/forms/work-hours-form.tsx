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
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/auth";
import { calculateShiftDuration } from "@/lib/calculate-shift-duration";
import type { Shift } from "@/types";

export const WorkHoursForm = () => {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState<Shift>({
    shiftStart: "00:00",
    shiftEnd: "00:00",
    totalHours: {
      hours: 0,
      minutes: 0,
      decimalHours: 0,
    },
    date: new Date(),
  });

  const { user } = useAuth();
  const uid = user.uid;

  const onSubmitFunc = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const calculatedTotalHours = calculateShiftDuration(
      shift.shiftStart,
      shift.shiftEnd,
    );

    if (calculatedTotalHours.decimalHours <= 0) {
      setErrorMessage('Worked Hours must be greater than 0'
      )
      return
    }

    const payload = {
      ...shift,
      totalHours: calculatedTotalHours,
    };
    setShift(payload);

    try {
      const docRef = await addDoc(
        collection(db, "users", uid, "shifts"),
        payload,
      );
      console.log("Document written with ID: ", docRef.id);
      console.log("Saved payload:", payload);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

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
            value={shift.shiftStart}
            onChange={(e) =>
              setShift({
                ...shift,
                shiftStart: e.target.value,
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
            value={shift.shiftEnd}
            onChange={(e) =>
              setShift({
                ...shift,
                shiftEnd: e.target.value,
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
                {shift.date ? shift.date.toLocaleDateString() : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={shift.date}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setShift({
                    ...shift,
                    date: date ?? new Date(),
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
      {errorMessage}
      <p>Total: {shift.totalHours.hours + ":" + shift.totalHours.minutes}</p>
      <p>{shift.date.toLocaleDateString()}</p>
    </div>
  );
};
