import { supabase } from "@/config/supabase";

export const deleteShift = async (id: number) => {
  const { error } = await supabase.from("work_hours").delete().eq("id", id);

  if (error) {
    throw new Error(
      `Failed to delete work hour with id=${id}: ${error.message}`,
    );
  }

  return { id };
};

export const addShift = async (dataToInsert: {}) => {
  const { data, error } = await supabase
    .from("work_hours")
    .insert(dataToInsert)
    .select();

  return { data, error };
};

export const fetchShift = async () => {
  const { data, error } = await supabase.from("work_hours").select();
  if (error) throw error;
  return { data, error };
};
