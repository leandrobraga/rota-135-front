import { useQuery } from "@tanstack/react-query";

import { TripsService } from "#/features/trips/services/trips.service";
import type { ListTripsParams } from "#/features/trips/types";

export const tripsQueryKeys = {
	all: ["trips"] as const,
	list: (params: ListTripsParams) =>
		[...tripsQueryKeys.all, "list", params] as const,
	detail: (id: string) => [...tripsQueryKeys.all, "detail", id] as const,
	range: (from: string, to: string) =>
		[...tripsQueryKeys.all, "range", from, to] as const,
	availability: (scheduledAt: string, excludeTripId?: string) =>
		[
			...tripsQueryKeys.all,
			"availability",
			scheduledAt,
			excludeTripId,
		] as const,
};

export function useTripsQuery(params: ListTripsParams = {}) {
	return useQuery({
		queryKey: tripsQueryKeys.list(params),
		queryFn: () => TripsService.list(params),
	});
}
