import type { Shift } from "@/types";

export const convertTimeToTimestamp = (shift: Shift) => {
  if (!shift.shift_date) throw new Error("Missing shift_date");

  const date = new Date(shift.shift_date);

  const [startHourStr = "0", startMinuteStr = "0"] = (
    shift.start_shift ?? ""
  ).split(":");
  const [endHourStr = "0", endMinuteStr = "0"] = (shift.end_shift ?? "").split(
    ":",
  );

  const startHour = Number(startHourStr);
  const startMinute = Number(startMinuteStr);
  const endHour = Number(endHourStr);
  const endMinute = Number(endMinuteStr);

  const startDateTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    startHour,
    startMinute,
  );

  const endDateTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    endHour,
    endMinute,
  );

  if (startDateTime > endDateTime) {
    startDateTime.setDate(startDateTime.getDate() - 1);
  }

  return {
    started_at_utc: startDateTime,
    ended_at_utc: endDateTime,
  };
};

export const decimalToHours = (decimalHours: number): string => {
  const decimalPart = Math.round((decimalHours % 1) * 60);
  const hours = Math.floor(decimalHours);
  const finalNumber = [
    String(hours),
    ":",
    String(decimalPart).padStart(2, "0"),
  ];
  return finalNumber.join("");
};
