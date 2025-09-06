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

type Shift = {
  shiftStart: string;
  shiftEnd: string;
  totalHours: {
    hours: number;
    minutes: number;
    decimalHours: number;
  };
  date: Date;
};

export const WorkHoursForm = () => {
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

  const calculateShiftDuration = (startShift: string, endShift: string) => {
    const [sh, sm] = startShift.split(":").map(Number);
    const [eh, em] = endShift.split(":").map(Number);

    const startMin = sh * 60 + sm;
    let endMin = eh * 60 + em;

    if (endMin < startMin) endMin += 24 * 60;

    const totalMinutes = endMin - startMin;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const decimalHours = Math.round((totalMinutes / 60) * 100) / 100;
    return { hours, minutes, decimalHours };
  };

  const onSubmitFunc = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const calculatedTotalHours = calculateShiftDuration(
      shift.shiftStart,
      shift.shiftEnd,
    );

    setShift({
      ...shift,
      totalHours: calculatedTotalHours,
    });
    const { shiftStart, shiftEnd, totalHours, date } = shift;
    try {
      const docRef = await addDoc(collection(db, "users/test-user/shifts"), {
        shiftStart: shiftStart,
        shiftEnd: shiftEnd,
        totalHours: totalHours,
        date: date,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="mt-5 flex w-full flex-col items-center justify-center">
      <form
        className="flex w-full flex-col items-start justify-center gap-2.5 md:w-xs"
        onSubmit={onSubmitFunc}
      >
        <div className="grid w-full grid-cols-6 space-y-2 space-x-4">
          <div className="col-span-3 space-y-2">
            <Label htmlFor="shiftStart">Shift Start</Label>
            <Input
              type="time"
              placeholder="Shift Start"
              name="shiftStart"
              value={shift.shiftStart}
              onChange={(e) =>
                setShift({
                  ...shift,
                  shiftStart: e.target.value,
                })
              }
            />
          </div>
          <div className="col-span-3 space-y-2">
            <Label htmlFor="shiftEnd">Shift End</Label>
            <Input
              type="time"
              placeholder="Shift End"
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
                className="w-32 justify-between font-normal"
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
      {shift.totalHours.hours + ":" + shift.totalHours.minutes}
      {shift.date.toLocaleDateString()}
    </div>
  );
};
