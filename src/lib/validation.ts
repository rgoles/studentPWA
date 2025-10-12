import * as z from "zod";

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(5, { message: "Password must be longer than 5 chars" }),
});

export const ShiftSchema = z.object({
  start_shift: z
    .string()
    .min(1, { message: "Start time is required" })
    .regex(/^([01]?\d|2[0-3]):[0-5]\d$/, { 
      message: "Please enter a valid time format (HH:MM)" 
    }),
  end_shift: z
    .string()
    .min(1, { message: "End time is required" })
    .regex(/^([01]?\d|2[0-3]):[0-5]\d$/, { 
      message: "Please enter a valid time format (HH:MM)" 
    }),
  shift_date: z.date({
    required_error: "Please select a date",
    invalid_type_error: "Please select a valid date"
  })
// }).refine((data) => {
//   // Validate that end time is after start time
//   const [startHour, startMinute] = data.start_shift.split(':').map(Number);
//   const [endHour, endMinute] = data.end_shift.split(':').map(Number);
  
//   const startMinutes = startHour * 60 + startMinute;
//   const endMinutes = endHour * 60 + endMinute;
  
//   return endMinutes > startMinutes;
// }, {
//   message: "End time must be after start time",
//   path: ["end_shift"]
});
