import { useQuery } from "@tanstack/react-query";

import { driversQueryKeys } from "#/features/drivers/queries/use-drivers-query";
import { DriversService } from "#/features/drivers/services/drivers.service";

export function useDriverByIdQuery(id: string) {
	return useQuery({
		queryKey: driversQueryKeys.detail(id),
		queryFn: () => DriversService.getById(id),
		enabled: Boolean(id),
	});
}
