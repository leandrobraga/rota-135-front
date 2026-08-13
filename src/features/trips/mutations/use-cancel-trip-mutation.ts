import { useMutation, useQueryClient } from "@tanstack/react-query";

import { tripsQueryKeys } from "#/features/trips/queries/use-trips-query";
import { TripsService } from "#/features/trips/services/trips.service";
import type { CancelTripInput } from "#/features/trips/types";
import { toast } from "#/lib/toast";

export function useCancelTripMutation(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CancelTripInput) => TripsService.cancel(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: tripsQueryKeys.all });
			queryClient.invalidateQueries({
				queryKey: tripsQueryKeys.detail(id),
			});
			toast.success("Corrida cancelada");
		},
	});
}
