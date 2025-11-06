import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import {
  CalendarIcon,
  ClockIcon,
  DotsThreeOutlineVerticalIcon,
  FunnelIcon,
} from "@phosphor-icons/react";
import { decimalToHours } from "@/lib/timeUtils";
import {
  useWorkHoursMutations,
  useWorkHoursQuery,
} from "@/hooks/use-work-hours";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useMemo, useState } from "react";
import type { Shift } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile.ts";
import { AddShiftLauncher } from "@/components/ui/add-shift-launcher";
import { useAuth } from "@/auth";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ShiftForm } from "../forms/shift-form";

export const ShiftsListScreen = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { remove } = useWorkHoursMutations();
  const { refetch, shifts, error, isLoading } = useWorkHoursQuery();

  const [shiftAddMenuOpen, setShiftAddMenuOpen] = useState(false);

  const [isFiltered, setIsFiltered] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedShiftRemove, setSelectedShiftRemove] = useState<Shift | null>(
    null,
  );
  const [selectedShiftEdit, setSelectedShiftEdit] = useState<Shift | null>(
    null,
  );
  const items = (shifts as Shift[]) ?? [];

  const getAllMonths = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push({
        value: i,
        label: new Date(2000, i, 1).toLocaleString("hr-HR", {
          month: "long",
        }),
      });
    }
    return months;
  };

  const months = getAllMonths();

  const filteredShifts = useMemo(() => {
    if (!shifts) return [];
    const targetMonth = selectedMonth.getMonth();
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
  }, [shifts, selectedMonth]);

  const calculatedTotalHours = useMemo(() => {
    const list = isFiltered ? filteredShifts : items;
    return list.reduce((acc, s) => acc + Number(s.hours_worked ?? 0), 0);
  }, [isFiltered, filteredShifts, items]);

  const handleAddShiftSuccess = () => {
    void refetch();
    setShiftAddMenuOpen(false);
  };

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading || !shifts) return <div>Loading...</div>;
  if (!user) return <p>You must login</p>;

  // const dateLabel = selectedMonth.toLocaleDateString("hr-HR", {
  //   month: "numeric",
  //   year: "numeric",
  // });

  const displayedShifts = isFiltered ? filteredShifts : items;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 p-4">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-row items-center justify-between gap-3">
          <div>
            <h1 className="text-foreground text-2xl font-semibold">
              My Shifts
            </h1>
            <p className="text-muted-foreground mt-1">See your past shifts</p>
          </div>
          <AddShiftLauncher
            userId={user.id}
            isMobile={isMobile}
            open={shiftAddMenuOpen}
            onOpenChange={setShiftAddMenuOpen}
            onSuccess={handleAddShiftSuccess}
          />
        </div>
      </div>
      <div className="flex justify-between gap-1">
        <Button
          variant={isFiltered ? "secondary" : "default"}
          onClick={() => setIsFiltered((prev) => !prev)}
        >
          <FunnelIcon />
          {isFiltered ? "Show All" : "Filter by Month"}
        </Button>

        <Select
          value={String(selectedMonth.getMonth())}
          onValueChange={(value) => {
            const indexId = Number(value);

            const next = new Date(selectedMonth);
            next.setFullYear(new Date().getFullYear());
            next.setMonth(indexId, 1);
            next.setHours(0, 0, 0, 0);

            setSelectedMonth(next);
            setIsFiltered(true);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a month" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Months</SelectLabel>
              {months.map((month) => (
                <SelectItem key={month.value} value={String(month.value)}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {displayedShifts.length > 0 && (
        <Card className="bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Total Hours:</span>
            <span className="text-foreground font-mono text-lg font-semibold">
              {decimalToHours(calculatedTotalHours)}
            </span>
          </div>
        </Card>
      )}
      <div className="space-y-3">
        {displayedShifts.length === 0 ? (
          <Card className="p-6 text-center">
            <ClockIcon className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
            <p className="text-muted-foreground">
              No worked hours recorded yet
            </p>
          </Card>
        ) : (
          displayedShifts.map((shift) => (
            <Card key={shift.id} className="hover:bg-accent/50 p-4">
              <div className="flex flex-row justify-between gap-3 sm:items-center">
                <div className="flex flex-col gap-3 md:flex-1 md:flex-row">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <CalendarIcon className="text-muted-foreground h-6 w-6 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-muted-foreground">Date</p>
                      <p className="text-foreground truncate text-sm font-medium">
                        {new Date(shift.ended_at_utc).toLocaleDateString(
                          "hr-HR",
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <ClockIcon className="text-muted-foreground h-6 w-6" />
                    <div className="min-w-0">
                      <p className="text-muted-foreground">Time</p>
                      <p className="text-foreground truncate text-sm font-medium">
                        {new Date(shift.started_at_utc).toLocaleTimeString(
                          "hr-HR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                        {" — "}
                        {new Date(shift.ended_at_utc).toLocaleTimeString(
                          "hr-HR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-start sm:justify-start">
                    <Badge
                      variant="outline"
                      className="w-full font-mono text-sm"
                    >
                      {decimalToHours(shift.hours_worked ?? 0)} hours worked
                    </Badge>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Open shift actions"
                      className="h-8 w-8"
                    >
                      <DotsThreeOutlineVerticalIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuLabel>Shift</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setSelectedShiftRemove(shift);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setSelectedShiftEdit(shift);
                        console.log(shift);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))
        )}

        <Dialog
          open={!!selectedShiftRemove}
          onOpenChange={(v) => !v && setSelectedShiftRemove(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this shift?</DialogTitle>
              <DialogDescription>
                {selectedShiftRemove
                  ? `This will permanently delete the shift from ${new Date(
                      selectedShiftRemove.started_at_utc,
                    ).toLocaleString("hr-HR")}.`
                  : null}
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                disabled={remove.isPending}
                onClick={() => {
                  if (!selectedShiftRemove?.id) return;
                  remove.mutate(selectedShiftRemove.id, {
                    onSuccess: () => {
                      setSelectedShiftRemove(null);
                      refetch();
                    },
                  });
                }}
                className="rounded px-3 py-1"
              >
                {remove.isPending ? "Deleting..." : "Confirm"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!selectedShiftEdit}
          onOpenChange={(v) => !v && setSelectedShiftEdit(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit shift</DialogTitle>
              <DialogDescription>
                {selectedShiftEdit
                  ? `Do you want to edit this shift? ${new Date(
                      selectedShiftEdit.started_at_utc,
                    ).toLocaleString("hr-HR")}.`
                  : null}
              </DialogDescription>
            </DialogHeader>
            <div>
              {selectedShiftEdit ? (
                <ShiftForm
                  formMode="edit"
                  userId={selectedShiftEdit.user_id}
                  onSuccess={() => setSelectedShiftEdit(null)}
                  shiftData={selectedShiftEdit}
                />
              ) : null}
              <p>{JSON.stringify(selectedShiftEdit)}</p>
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button
                variant="default"
                disabled={remove.isPending}
                onClick={() => {}}
                className="rounded px-3 py-1"
              >
                {remove.isPending ? "Deleting..." : "Save"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
