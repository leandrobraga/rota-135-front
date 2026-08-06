import { useQuery } from "@tanstack/react-query";

import { DriversService } from "#/features/drivers/services/drivers.service";
import type { ListDriversParams } from "#/features/drivers/types";

export const driversQueryKeys = {
	all: ["drivers"] as const,
	list: (params: ListDriversParams) =>
		[...driversQueryKeys.all, "list", params] as const,
	detail: (id: string) => [...driversQueryKeys.all, "detail", id] as const,
};

export function useDriversQuery(params: ListDriversParams = {}) {
	return useQuery({
		queryKey: driversQueryKeys.list(params),
		queryFn: () => DriversService.list(params),
	});
}
