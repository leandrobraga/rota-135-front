import { useMutation, useQueryClient } from "@tanstack/react-query";

import { vehiclesQueryKeys } from "#/features/vehicles/queries/use-vehicles-query";
import { VehiclesService } from "#/features/vehicles/services/vehicles.service";
import { toast } from "#/lib/toast";

export function useDeactivateVehicleMutation(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => VehiclesService.deactivate(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
			toast.success("Veículo desativado");
		},
	});
}
