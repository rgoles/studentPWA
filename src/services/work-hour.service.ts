import { supabase } from "@/config/supabase";
import type { Shift } from "@/types";

export const deleteShift = async (id: number) => {
  const { error } = await supabase.from("shifts").delete().eq("id", id);

  if (error) {
    throw new Error(
      `Failed to delete work hour with id=${id}: ${error.message}`,
    );
  }

  return { id };
};

export const addShift = async (shift: Shift) => {
  const { data, error } = await supabase.from("shifts").insert(shift).select();
  return { data, error };
};

export const fetchShift = async () => {
  const { data, error } = await supabase.from("shifts_with_hours").select();
  if (error) throw error;
  return { data, error };
};
