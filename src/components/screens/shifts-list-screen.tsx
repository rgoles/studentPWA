import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import {
  CalendarIcon,
  ClockIcon,
  DotsThreeOutlineVerticalIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { decimalToHours } from "@/lib/timeUtils";
import {
  useWorkHoursMutations,
  useWorkHoursQuery,
} from "@/hooks/use-work-hours";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer.tsx";
import { useIsMobile } from "@/hooks/use-mobile.ts";
import { ShiftAddForm } from "@/components/forms/shift-add-form.tsx";
import { useAuth } from "@/auth";

export const ShiftsListScreen = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { remove } = useWorkHoursMutations();
  const { refetch, shifts, error, isLoading } = useWorkHoursQuery();

  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [open, setOpen] = useState(false);

  const items = (shifts?.data as Shift[]) ?? [];
  const calculatedTotalHours = useMemo(
    () => items.reduce((acc, s) => acc + Number(s.hours_worked ?? 0), 0),
    [items],
  );

  const handleAddShiftSuccess = () => {
    void refetch();
    setOpen(false);
  };

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading || !shifts) return <div>Loading...</div>;
  if (!user) return <p>You must login</p>;

  const AddShiftLauncher = () =>
    isMobile ? (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" onClick={() => setOpen(true)}>
            <PlusIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Add shift</DrawerTitle>
            <DrawerDescription>Enter your shift details.</DrawerDescription>
          </DrawerHeader>
          <div className="mx-5">
            <ShiftAddForm userId={user.id} onSuccess={handleAddShiftSuccess} />
          </div>
          <DrawerFooter className="mb-8 pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    ) : (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setOpen(true)}>
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-fit sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add shift</DialogTitle>
            <DialogDescription>Enter your shift details.</DialogDescription>
          </DialogHeader>
          <ShiftAddForm userId={user.id} onSuccess={handleAddShiftSuccess} />
        </DialogContent>
      </Dialog>
    );

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 p-4">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-row items-center justify-between gap-3">
          <div>
            <h1 className="text-foreground text-2xl font-semibold">
              My Shifts
            </h1>
            <p className="text-muted-foreground mt-1">See your past shifts</p>
          </div>
          <AddShiftLauncher />
        </div>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <Card className="p-6 text-center">
            <ClockIcon className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
            <p className="text-muted-foreground">
              No worked hours recorded yet
            </p>
          </Card>
        ) : (
          items.map((shift) => (
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
                        setSelectedShift(shift);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))
        )}

        <Dialog
          open={!!selectedShift}
          onOpenChange={(v) => !v && setSelectedShift(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this shift?</DialogTitle>
              <DialogDescription>
                {selectedShift
                  ? `This will permanently delete the shift from ${new Date(
                      selectedShift.started_at_utc,
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
                  if (!selectedShift?.id) return;
                  remove.mutate(selectedShift.id, {
                    onSuccess: () => {
                      setSelectedShift(null);
                      refetch(); // or invalidate
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

        {items.length > 0 && (
          <Card className="bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Total</span>
              <span className="text-foreground font-mono text-lg font-semibold">
                {decimalToHours(calculatedTotalHours)}
              </span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
