import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { CalendarIcon, ClockIcon, TrashIcon } from "@phosphor-icons/react";
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
import { useState } from "react";
import { boolean } from "zod";
import { Button } from "../ui/button";

export const ShiftsListScreen = () => {
  const { remove } = useWorkHoursMutations();
  const { shifts, error, isLoading } = useWorkHoursQuery();
  const [isOpen, setOpen] = useState(false);

  if (error) return <div>Error {error.message}</div>;
  if (isLoading || !shifts) return <div>Loading...</div>;

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

      {/* Mobile-first list */}
      <div className="space-y-3">
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
                {/* Date section */}
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

                  {/* Time section */}
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <ClockIcon className="text-muted-foreground h-6 w-6" />
                    <div className="min-w-0">
                      <p className="text-muted-foreground">Time</p>
                      <p className="text-foreground truncate text-sm font-medium">
                        {shift.start_time} - {shift.end_time}
                      </p>
                    </div>
                  </div>
                  {/* Total hours */}
                  <div className="flex justify-start sm:justify-start">
                    <Badge
                      variant="outline"
                      className="w-full font-mono text-sm"
                    >
                      {decimalToHours(shift.total_hours)} hours worked
                    </Badge>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={"destructive"}
                      className="cursor-pointer rounded p-1"
                    >
                      <TrashIcon className="w-10 md:w-fit" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                      <Button
                        variant={"destructive"}
                        onClick={() => remove.mutate(shift.id)}
                        className="rounded px-3 py-1"
                      >
                        Confirm
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* <button
                  onClick={() => remove.mutate(shift.id)}
                  className="bg-destructive text-primary-foreground cursor-pointer rounded p-1"
                >
                  <TrashIcon className="w-10 md:w-fit" />
                </button> */}
              </div>
            </Card>
          ))
        )}
      </div>

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
  );
};
