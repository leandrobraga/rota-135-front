import { useQuery } from "@tanstack/react-query";

import { vehiclesQueryKeys } from "#/features/vehicles/queries/use-vehicles-query";
import { VehiclesService } from "#/features/vehicles/services/vehicles.service";

export function useVehicleByIdQuery(id: string) {
	return useQuery({
		queryKey: vehiclesQueryKeys.detail(id),
		queryFn: () => VehiclesService.getById(id),
		enabled: Boolean(id),
	});
}
