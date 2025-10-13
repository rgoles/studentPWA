import * as z from "zod";

export const UserLoginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(5, { message: "Password must be longer than 5 chars" }),
});

export const ShiftSchema = z.object({
  start_shift: z
    .string()
    .min(1, { message: "Start time is required" })
    .regex(/^([01]?\d|2[0-3]):[0-5]\d$/, {
      message: "Please enter a valid time format (HH:MM)",
    }),
  end_shift: z
    .string()
    .min(1, { message: "End time is required" })
    .regex(/^([01]?\d|2[0-3]):[0-5]\d$/, {
      message: "Please enter a valid time format (HH:MM)",
    }),
  shift_date: z.date({
    error: "Please select a valid date",
  }),
});
