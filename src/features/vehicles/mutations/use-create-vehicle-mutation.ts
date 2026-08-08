import { useMutation, useQueryClient } from "@tanstack/react-query";

import { vehiclesQueryKeys } from "#/features/vehicles/queries/use-vehicles-query";
import { VehiclesService } from "#/features/vehicles/services/vehicles.service";
import type { CreateVehicleInput } from "#/features/vehicles/types";
import { toast } from "#/lib/toast";

export function useCreateVehicleMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreateVehicleInput) => VehiclesService.create(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
			toast.success("Veículo criado com sucesso");
		},
	});
}
