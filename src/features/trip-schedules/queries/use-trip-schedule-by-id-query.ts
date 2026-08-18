import { useQuery } from "@tanstack/react-query";

import { TripSchedulesService } from "#/features/trip-schedules/services/trip-schedules.service";

export const tripSchedulesQueryKeys = {
	all: ["trip-schedules"] as const,
	detail: (id: string) =>
		[...tripSchedulesQueryKeys.all, "detail", id] as const,
};

export function useTripScheduleByIdQuery(id: string) {
	return useQuery({
		queryKey: tripSchedulesQueryKeys.detail(id),
		queryFn: () => TripSchedulesService.getById(id),
		enabled: Boolean(id),
	});
}
