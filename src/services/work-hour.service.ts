import { supabase } from "@/config/supabase";
import type { Shift } from "@/types";

export const deleteShift = async (id: number): Promise<{ id: number }> => {
  const { error } = await supabase.from("shifts").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete shift: ${error.message}`);
  }

  return { id };
};

export const addShift = async (shift: Shift) => {
  const { data, error } = await supabase.from("shifts").insert(shift).select();

  // Throw error so React Query can handle it properly
  if (error) {
    throw new Error(`Failed to add shift: ${error.message}`);
  }

  return data; // Return just the data on success
};

export const fetchShift = async () => {
  const { data, error } = await supabase.from("shifts_with_hours").select();

  // Throw error so React Query can handle it properly
  if (error) {
    throw new Error(`Failed to fetch shifts: ${error.message}`);
  }

  return data; // Return just the data on success
};
