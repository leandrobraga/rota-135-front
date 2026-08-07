import { useMutation, useQueryClient } from "@tanstack/react-query";

import { vehiclesQueryKeys } from "#/features/vehicles/queries/use-vehicles-query";
import { VehiclesService } from "#/features/vehicles/services/vehicles.service";
import type { UpdateVehicleInput } from "#/features/vehicles/types";

export function useUpdateVehicleMutation(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateVehicleInput) => VehiclesService.update(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
		},
	});
}
