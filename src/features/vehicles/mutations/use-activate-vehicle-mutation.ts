import { useMutation, useQueryClient } from "@tanstack/react-query";

import { vehiclesQueryKeys } from "#/features/vehicles/queries/use-vehicles-query";
import { VehiclesService } from "#/features/vehicles/services/vehicles.service";

export function useActivateVehicleMutation(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => VehiclesService.activate(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
		},
	});
}
