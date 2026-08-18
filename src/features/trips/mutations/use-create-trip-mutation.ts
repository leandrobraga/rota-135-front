import { useMutation, useQueryClient } from "@tanstack/react-query";

import { tripsQueryKeys } from "#/features/trips/queries/use-trips-query";
import { TripsService } from "#/features/trips/services/trips.service";
import type { CreateTripInput } from "#/features/trips/types";
import { toast } from "#/lib/toast";

export function useCreateTripMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreateTripInput) => TripsService.create(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: tripsQueryKeys.all });
			toast.success("Corrida criada com sucesso");
		},
	});
}
