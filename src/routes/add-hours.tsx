import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/add-hours")({
  component: RouteComponent,
});

type Shift = {
  shiftStart: string;
  shiftEnd: string;
  totalHours: {
    hours: number;
    minutes: number;
    decimalHours: number;
  };
};

function RouteComponent() {
  const [shift, setShift] = useState<Shift>({
    shiftStart: "00:00",
    shiftEnd: "00:00",
    totalHours: {
      hours: 0,
      minutes: 0,
      decimalHours: 0,
    },
  });

  const calcTotalHoursWorkedFunc = (startShift: string, endShift: string) => {
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

  const onSubmitFunc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const calculatedTotalHours = calcTotalHoursWorkedFunc(
      shift.shiftStart,
      shift.shiftEnd
    );

    setShift({
      ...shift,
      totalHours: calculatedTotalHours,
    });
  };

  useEffect(() => console.log(shift), [shift]);

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <form
        className="flex gap-2 w-xs justify-center items-center flex-col"
        onSubmit={onSubmitFunc}
      >
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
        <Button type="submit">Submit</Button>
      </form>
      {shift.totalHours.hours + ":" + shift.totalHours.minutes}
    </div>
  );
}
