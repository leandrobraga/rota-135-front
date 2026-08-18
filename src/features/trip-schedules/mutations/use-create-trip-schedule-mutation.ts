import { useMutation, useQueryClient } from "@tanstack/react-query";

import { tripSchedulesQueryKeys } from "#/features/trip-schedules/queries/use-trip-schedule-by-id-query";
import { TripSchedulesService } from "#/features/trip-schedules/services/trip-schedules.service";
import type { CreateTripScheduleInput } from "#/features/trip-schedules/types";
import { toast } from "#/lib/toast";

export function useCreateTripScheduleMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreateTripScheduleInput) =>
			TripSchedulesService.create(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: tripSchedulesQueryKeys.all });
			toast.success("Agendamento criado com sucesso");
		},
	});
}
