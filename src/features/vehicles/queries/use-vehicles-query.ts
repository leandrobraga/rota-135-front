import { useQuery } from "@tanstack/react-query";

import { VehiclesService } from "#/features/vehicles/services/vehicles.service";
import type { ListVehiclesParams } from "#/features/vehicles/types";

export const vehiclesQueryKeys = {
	all: ["vehicles"] as const,
	list: (params: ListVehiclesParams) =>
		[...vehiclesQueryKeys.all, "list", params] as const,
	detail: (id: string) => [...vehiclesQueryKeys.all, "detail", id] as const,
};

export function useVehiclesQuery(params: ListVehiclesParams = {}) {
	return useQuery({
		queryKey: vehiclesQueryKeys.list(params),
		queryFn: () => VehiclesService.list(params),
	});
}
