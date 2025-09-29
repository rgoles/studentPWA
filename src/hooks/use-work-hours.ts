import { deleteWorkHour } from '@/services/work-hour.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';


export function useWorkHoursMutations() {
  const qc = useQueryClient();

  const remove = useMutation({
    mutationFn: deleteWorkHour,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['work-hours'] }),
  });

  return { remove };
}
