import type { UserLoginSchema } from "@/lib/validation";
import type z from "zod";

export type ShiftPayload = {
  id?: string;
  user_id?: string;
  start_time: string;
  end_time: string;
  total_hours: number | null;
  shift_date: string;
};

export type ShiftUIState = {
  start_time: string;
  end_time: string;
  total_hours: number | null;
  shift_date: Date | null;
};

export type UserLoginType = z.infer<typeof UserLoginSchema>;
