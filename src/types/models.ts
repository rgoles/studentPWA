import type { UserLoginSchema } from "@/lib/validation";
import type z from "zod";

export type Shift = {
  start_time: string;
  end_time: string;
  total_hours: number | null;
  shift_date?: Date;
};

export type UserLoginType = z.infer<typeof UserLoginSchema>;
