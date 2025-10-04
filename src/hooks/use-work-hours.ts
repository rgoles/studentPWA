import { deleteWorkHour, fetchWorkHours } from "@/services/work-hour.service";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export function useWorkHoursMutations() {
  const qc = useQueryClient();

  const remove = useMutation({
    mutationFn: deleteWorkHour,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["work-hours-remove"] }),
  });

  return { remove };
}

export const useWorkHoursQuery = () => {
  const { data:shifts, error, isLoading } = useQuery({
    queryKey: ["work-hours-list"],
    queryFn: fetchWorkHours,
  });

  return { shifts, isLoading, error };
};
