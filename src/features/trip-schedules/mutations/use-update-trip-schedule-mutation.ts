import { useMutation, useQueryClient } from "@tanstack/react-query";

import { tripSchedulesQueryKeys } from "#/features/trip-schedules/queries/use-trip-schedule-by-id-query";
import { TripSchedulesService } from "#/features/trip-schedules/services/trip-schedules.service";
import type { UpdateTripScheduleInput } from "#/features/trip-schedules/types";
import { toast } from "#/lib/toast";

export function useUpdateTripScheduleMutation(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateTripScheduleInput) =>
			TripSchedulesService.update(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: tripSchedulesQueryKeys.all });
			toast.success("Agendamento atualizado");
		},
	});
}
