import { CaretRightIcon, TrendUpIcon } from "@phosphor-icons/react";
import { Card } from "../molecules/card";
import { Button } from "../catalyst/button";
import { useWorkHoursQuery } from "@/hooks/use-work-hours.ts";
import type { Shift } from "@/types";
import {
  decimalHoursToMinutes,
  decimalToHoursString,
  getCurrentDate,
} from "@/lib/timeUtils.ts";
import { useMemo, useState } from "react";
import { AddShiftLauncher } from "@/components/molecules/add-shift-launcher.tsx";
import { useAuth } from "@/auth";
import { useIsMobile } from "@/hooks/use-mobile.ts";

export const ShiftsDashboardScreen = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [shiftAddMenuOpen, setShiftAddMenuOpen] = useState(false);

  const { refetch, shifts, error, isLoading } = useWorkHoursQuery();
  const items = (shifts as Shift[]) ?? [];

  const handleAddShiftSuccess = () => {
    void refetch();
    setShiftAddMenuOpen(false);
  };

  const today = getCurrentDate();

  const filteredShifts = useMemo(() => {
    if (!shifts) return [];
    const targetMonth = today.month;
    return shifts
      .filter((arr: Shift) => {
        const shiftMonth = new Date(arr.ended_at_utc).getMonth();
        return shiftMonth === targetMonth;
      })
      .sort((a, b) => {
        const dateA = new Date(a.ended_at_utc).getTime();
        const dateB = new Date(b.ended_at_utc).getTime();
        return dateA - dateB;
      });
  }, [shifts, today.month]);

  const calculatedTotalHours = useMemo(() => {
    const list = filteredShifts;
    return list.reduce((acc, s) => acc + Number(s.hours_worked ?? 0), 0);
  }, [filteredShifts, items]);

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading || !shifts) return <div>Loading...</div>;
  if (!user) return <p>You must login</p>;

  return (
    <div className="m-2 mx-auto w-full max-w-6xl space-y-6">
      <h1 className={"text-4xl font-medium"}>
        {today.monthName} {today.year}
      </h1>
      <Card className={"bg-emerald-600 text-white"}>
        <Card.Header className="flex flex-row items-center space-x-2">
          <TrendUpIcon weight={"bold"} /> <span>Ovaj mjesec</span>
        </Card.Header>
        <Card.Body className={"text-3xl font-medium"}>
          {new Intl.NumberFormat("hr-HR", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(calculatedTotalHours * 6.56)}
        </Card.Body>
        <Card.Footer className="grid grid-cols-12">
          <div className="col-span-4 flex flex-col text-sm">
            <p>Odrađeni sati</p>
            <p className={"text-lg"}>{calculatedTotalHours}</p>
          </div>
          <div className="col-span-4 flex flex-col text-sm">
            <p>Smjene</p>
            <p className={"text-lg"}>{filteredShifts.length}</p>
          </div>
          <div className="col-span-4 flex flex-col text-sm">
            <p>Satnica</p>
            <p className={"text-lg"}>6,56 EUR/h</p>
          </div>
        </Card.Footer>
      </Card>
      <AddShiftLauncher
        userId={user.id}
        isMobile={isMobile}
        open={shiftAddMenuOpen}
        onOpenChange={setShiftAddMenuOpen}
        onSuccess={handleAddShiftSuccess}
      />
      <div className="flex items-center justify-between font-medium">
        <p>Recent Shifts</p>
        <Button
          onClick={() => {
            console.log(filteredShifts);
          }}
          plain
          className="items-center"
        >
          See all <CaretRightIcon />
        </Button>
      </div>
      <div className={"space-y-2"}>
        {filteredShifts.length > 0 ? (
          filteredShifts
            .slice(-3)
            .reverse()
            .map((shift) => (
              <Card
                className={
                  "flex h-24 w-full flex-row items-center justify-between space-x-5 p-4"
                }
                key={shift.id}
              >
                <div
                  className={"flex flex-col place-content-center text-center"}
                >
                  <p>
                    {new Date(shift.ended_at_utc).toLocaleDateString("hr-HR", {
                      month: "short",
                    })}
                  </p>
                  <p className={"text-lg font-medium"}>
                    {new Date(shift.ended_at_utc).toLocaleDateString("hr-HR", {
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className={"flex flex-col place-content-center"}>
                  <p className={"text-sm font-medium"}>
                    {new Date(shift.started_at_utc).toLocaleTimeString(
                      "hr-HR",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                    {" — "}
                    {new Date(shift.ended_at_utc).toLocaleTimeString("hr-HR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className={"text-sm"}>
                    {decimalToHoursString(shift.hours_worked)} h rada
                  </p>
                </div>
                <div>
                  <p
                    className={
                      "text-center text-lg font-medium text-emerald-600"
                    }
                  >
                    +{" "}
                    {new Intl.NumberFormat("hr-HR", {
                      style: "currency",
                      currency: "EUR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(
                      (decimalHoursToMinutes(shift.hours_worked) / 60) * 6.56,
                    )}
                  </p>
                </div>
              </Card>
            ))
        ) : (
          <div className="p-6 text-center"> the list is empty</div>
        )}{" "}
      </div>
    </div>
  );
};
