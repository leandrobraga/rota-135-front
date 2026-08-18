import { useQuery } from "@tanstack/react-query";

import { TripSchedulesService } from "#/features/trip-schedules/services/trip-schedules.service";
import type {
	ListTripSchedulesParams,
	StaffAvailabilityParams,
	TripScheduleAvailabilityParams,
} from "#/features/trip-schedules/types";

export const tripSchedulesQueryKeys = {
	all: ["trip-schedules"] as const,
	list: (params: ListTripSchedulesParams) =>
		[...tripSchedulesQueryKeys.all, "list", params] as const,
	detail: (id: string) =>
		[...tripSchedulesQueryKeys.all, "detail", id] as const,
	staffAvailability: (params: StaffAvailabilityParams) =>
		[...tripSchedulesQueryKeys.all, "staff-availability", params] as const,
	availability: (params: TripScheduleAvailabilityParams) =>
		[...tripSchedulesQueryKeys.all, "availability", params] as const,
};

export function useTripScheduleByIdQuery(id: string) {
	return useQuery({
		queryKey: tripSchedulesQueryKeys.detail(id),
		queryFn: () => TripSchedulesService.getById(id),
		enabled: Boolean(id),
	});
}
