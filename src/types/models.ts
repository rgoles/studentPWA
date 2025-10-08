import type { UserLoginSchema } from "@/lib/validation";
import type z from "zod";

// TODO: Pregledat sve tipove i modele koje sam definirao, prepravit shift-add-formu
//  da koristi zod za validaciju i da koristi react-hook-form

export type Shift = {
  id: number;
  user_id: string;
  start_time: string;
  end_time: string;
  total_hours?: number | null;
  shift_date: string;
};

export type NewShift = Omit<Shift, "id">;

export type UserLoginType = z.infer<typeof UserLoginSchema>;
