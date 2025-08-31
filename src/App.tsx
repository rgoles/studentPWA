import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

type Shift = {
  shiftStart: string;
  shiftEnd: string;
  totalHours: string;
};

function App() {
  const [shift, setShift] = useState<Shift>({
    shiftStart: "00:00",
    shiftEnd: "00:00",
    totalHours: "0",
  });

  // TODO: Extract this function, rework it or "optimize" it
  const calcTotalHoursWorkedFunc = (startShift: string, endShift: string) => {
    let totalHours = 0;
    let totalMinutes = 0;
    let finalCalc = "";

    const start = startShift.split(":");
    const end = endShift.split(":");

    console.log(start);
    console.log(end);

    // pretvorba u minute
    totalHours = (Number(end[0]) - Number(start[0])) * 60;

    // TODO: This is a "bug" because i cannot do 00 - 30 since its -30 in mins i need some other way to calculate it
    totalMinutes = Number(end[1]) - Number(start[1]);

    finalCalc = String(totalHours) + ":" + String(totalMinutes);

    return finalCalc;
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
      {shift.totalHours}
    </div>
  );
}

export default App;
