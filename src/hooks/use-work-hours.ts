import {
  addShift,
  deleteShift,
  editShift,
  fetchShift,
} from "@/services/work-hour.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useWorkHoursMutations() {
  const qc = useQueryClient();

  const add = useMutation({
    mutationFn: addShift,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["work-hours-list"] }),
  });

  const edit = useMutation({
    mutationFn: editShift,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["work-hours-list"] }),
  });

  const remove = useMutation({
    mutationFn: deleteShift,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["work-hours-list"] }),
  });

  return { add, edit, remove };
}

export const useWorkHoursQuery = () => {
  const {
    data: shifts,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["work-hours-list"],
    queryFn: fetchShift,
  });

  return { refetch, shifts, isLoading, error };
};
