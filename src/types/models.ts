import type { UserLoginSchema, ShiftSchema } from "@/lib/validation";
import type z from "zod";

// Database model - what comes from Supabase
export type ShiftRecord = {
  id: number;
  user_id: string;
  started_at_utc: string; 
  ended_at_utc: string; 
  hours_worked?: number;
  // total_hours?: number | null;
};

export type Shift = {
  id?: number;
  user_id: string;
  started_at_utc: Date;
  ended_at_utc: Date;
  hours_worked?: number;
  // total_hours?: number | null;

  start_shift?: string;  
  end_shift?: string;    
  shift_date?: Date;     
};

export type UserLoginType = z.infer<typeof UserLoginSchema>;
export type ShiftFormType = z.infer<typeof ShiftSchema>;
