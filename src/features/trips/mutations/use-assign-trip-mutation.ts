import { useMutation, useQueryClient } from "@tanstack/react-query";

import { tripsQueryKeys } from "#/features/trips/queries/use-trips-query";
import { TripsService } from "#/features/trips/services/trips.service";
import type { AssignTripInput } from "#/features/trips/types";
import { toast } from "#/lib/toast";

export function useAssignTripMutation(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: AssignTripInput) => TripsService.assign(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: tripsQueryKeys.all });
			queryClient.invalidateQueries({
				queryKey: tripsQueryKeys.detail(id),
			});
			toast.success("Motorista e veículo atribuídos");
		},
	});
}
