import {
  addShift,
  deleteShift,
  fetchShift,
} from "@/services/work-hour.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useWorkHoursMutations() {
  const qc = useQueryClient();

  const add = useMutation({
    mutationFn: addShift,
  });

  const remove = useMutation({
    mutationFn: deleteShift,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["work-hours-list"] }),
  });

  return { add, remove };
}

export const useWorkHoursQuery = () => {
  const {
    data: shifts,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["work-hours-list"],
    queryFn: fetchShift,
  });

  return { shifts, isLoading, error };
};
