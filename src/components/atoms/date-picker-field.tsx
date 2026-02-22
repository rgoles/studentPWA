import { useState } from "react";
import { Button } from "@/components/catalyst/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";

type Props = {
  label: string;
  value?: Date;
  onChange: (date: Date) => void;
  error?: string;
};

export const DatePickerField = ({ label, value, onChange, error }: Props) => {
  const [open, setOpen] = useState(false);

  const dateLabel = value ? value.toLocaleDateString("hr-HR") : "Select date";

  return (
    <div className="flex flex-col space-y-2">
      <label className="px-1 text-sm font-medium">{label}</label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button color="light" className="justify-between font-normal">
            <span>{dateLabel}</span>
            <ChevronDownIcon className="ml-2 h-4 w-4 opacity-70" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              if (!date) return;
              onChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
