import { supabase } from "@/config/supabase";

export async function deleteWorkHour(id: number) {
  const { error } = await supabase.from("work_hours").delete().eq("id", id);

  if (error) {
    throw new Error(
      `Failed to delete work hour with id=${id}: ${error.message}`,
    );
  }

  return { id };
}
