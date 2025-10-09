import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import {
  CalendarIcon,
  ClockIcon,
  DotsThreeOutlineVerticalIcon,
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
import { useState } from "react";
import type { Shift } from "@/types";

export const ShiftsListScreen = () => {
  const { remove } = useWorkHoursMutations();
  const { shifts, error, isLoading } = useWorkHoursQuery();
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  if (error) return <div>Error {error.message}</div>;
  if (isLoading || !shifts) return <div>Loading...</div>;
  // TODO: Napravit layout za svaki page univerzalni, zato da mogu uracunt mobilni nav npr , da ne moram na svakoj componenti zasebno koristis
  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 p-4">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-semibold">
            {"My Shifts"}
          </h1>
          <p className="text-muted-foreground mt-1">{"See your past shifts"}</p>
        </div>
      </div>

      <div className="space-y-3 pb-28">
        {shifts.data.length === 0 ? (
          <Card className="p-6 text-center">
            <ClockIcon className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
            <p className="text-muted-foreground">
              {"No worked hours recorded yet"}
            </p>
          </Card>
        ) : (
          shifts.data.map((shift) => (
            <Card key={shift.id} className="hover:bg-accent/50 p-4">
              <div className="flex flex-row justify-between gap-3 sm:items-center">
                <div className="flex flex-col gap-3 md:flex-1 md:flex-row">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <CalendarIcon className="text-muted-foreground h-6 w-6 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-muted-foreground">Date</p>
                      <p className="text-foreground truncate text-sm font-medium">
                        {shift.shift_date}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <ClockIcon className="text-muted-foreground h-6 w-6" />
                    <div className="min-w-0">
                      <p className="text-muted-foreground">Time</p>
                      <p className="text-foreground truncate text-sm font-medium">
                        {shift.start_time} - {shift.end_time}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-start sm:justify-start">
                    <Badge
                      variant="outline"
                      className="w-full font-mono text-sm"
                    >
                      {decimalToHours(shift.total_hours)} hours worked
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
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        console.log(shift);
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
          onOpenChange={(open) => !open && setSelectedShift(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                {selectedShift?.start_time} - This action cannot be undone. This
                will permanently delete your account and remove your data from
                our servers.
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
                  if (!selectedShift) return;
                  remove.mutate(selectedShift.id, {
                    onSuccess: () => {
                      setSelectedShift(null);
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
        {/* Summary footer for mobile */}
        {shifts.data.length > 0 && (
          <Card className="bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                {"Total Hours"}
              </span>
              <span className="text-foreground font-mono text-lg font-semibold"></span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
