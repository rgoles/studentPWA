import {
  CalendarDotsIcon,
  CaretRightIcon,
  ChartLineUpIcon,
  ClockIcon,
  DotIcon,
} from "@phosphor-icons/react";
import { useWorkHoursQuery } from "@/hooks/use-work-hours.ts";
import type { Shift } from "@/types";
import { Box, Button, Card, Text, Title } from "@mantine/core";

import {
  decimalHoursToMinutes,
  decimalToHoursString,
  getCurrentDate,
} from "@/lib/timeUtils.ts";
import { useMemo } from "react";
import { useAuth } from "@/auth";
import { useIsMobile } from "@/hooks/use-mobile.ts";
import { AddShiftDrawer } from "../organisms/add-shift-drawer";
import { useDisclosure } from "@mantine/hooks";

export const ShiftsDashboardScreen = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [opened, { open, close }] = useDisclosure(false);

  const { refetch, shifts, error, isLoading } = useWorkHoursQuery();
  const items = (shifts as Shift[]) ?? [];

  const handleAddShiftSuccess = () => {
    void refetch();
    close();
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
      <Title component={"h1"} mb={25} c={"dark.8"}>
        {today.monthName} {today.year}
      </Title>
      <Card
        shadow="sm"
        padding="xl"
        radius={"md"}
        withBorder
        bg={"blue.8"}
        c={"white"}
        className={"mb-2.5 space-y-6"}
      >
        <header className={"space-y-1"}>
          <p id="earnings-title" className="text-sm font-medium text-white">
            MJESEČNA ZARADA
          </p>
          <p className="text-4xl font-bold">
            {new Intl.NumberFormat("hr-HR", {
              style: "currency",
              currency: "EUR",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(calculatedTotalHours * 6.56)}
          </p>
        </header>
        <footer className="flex items-center justify-start gap-2">
          <Box
            component={"div"}
            bg={"blue.7"}
            bd="1px solid blue.6"
            className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium"
          >
            <ClockIcon size={16} />
            <span>{calculatedTotalHours} sati</span>
          </Box>
          <Box
            component={"div"}
            bg={"blue.7"}
            bd="1px solid blue.6"
            className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium"
          >
            <ChartLineUpIcon size={16} />
            <span>+16%</span>
          </Box>
        </footer>
      </Card>
      <Button
        radius={"md"}
        size="md"
        type="submit"
        disabled={isLoading}
        aria-disabled={isLoading}
        variant="filled"
        color="blue.8"
        onClick={open}
        fullWidth
      >
        Open Drawer
      </Button>
      <AddShiftDrawer
        isMobile={isMobile}
        userId={user.id}
        opened={opened}
        onClose={close}
        onSuccess={handleAddShiftSuccess}
      />

      <div className="flex items-center justify-between font-medium">
        <Text>Recent Shifts</Text>
        <Button
          onClick={() => {
            console.log(filteredShifts);
          }}
          variant="filled"
          className="items-center"
          color="blue.8"
          radius={"md"}
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
              <Card key={shift.id} radius={"md"} withBorder>
                <div className={"flex flex-row justify-between gap-3"}>
                  <div className={"mb-2 flex items-center gap-1"}>
                    <CalendarDotsIcon color={"#1864ab"} />
                    <Text fw={"700"} c={"blue.8"} size={"sm"}>
                      {new Date(shift.ended_at_utc).toLocaleDateString(
                        "hr-HR",
                        {
                          month: "short",
                        },
                      )}
                    </Text>
                    <Text fw={"700"} c={"blue.8"} size={"sm"}>
                      {new Date(shift.ended_at_utc).toLocaleDateString(
                        "hr-HR",
                        {
                          day: "numeric",
                        },
                      )}
                    </Text>
                  </div>
                  <div>
                    <Text fw={"700"} c={"blue.8"} size={"sm"}>
                      +{" "}
                      {new Intl.NumberFormat("hr-HR", {
                        style: "currency",
                        currency: "EUR",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(
                        (decimalHoursToMinutes(shift.hours_worked) / 60) * 6.56,
                      )}
                    </Text>
                  </div>
                </div>
                <div className={"flex flex-row items-center"}>
                  <Text fw={"600"} size={"sm"} c={"dark.4"}>
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
                  </Text>
                  <DotIcon />
                  <Text fw={"600"} size={"sm"} c={"dark.4"}>
                    {decimalToHoursString(shift.hours_worked)}h rada
                  </Text>
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
