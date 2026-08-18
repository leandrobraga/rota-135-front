import { useMutation, useQueryClient } from "@tanstack/react-query";

import { tripSchedulesQueryKeys } from "#/features/trip-schedules/queries/use-trip-schedule-by-id-query";
import { TripSchedulesService } from "#/features/trip-schedules/services/trip-schedules.service";
import { toast } from "#/lib/toast";

export function useCancelTripScheduleMutation(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => TripSchedulesService.cancel(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: tripSchedulesQueryKeys.all });
			toast.success("Agendamento cancelado");
		},
	});
}
