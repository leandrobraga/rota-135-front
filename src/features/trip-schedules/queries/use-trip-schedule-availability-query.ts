import { useQuery } from "@tanstack/react-query";

import { tripSchedulesQueryKeys } from "#/features/trip-schedules/queries/use-trip-schedule-by-id-query";
import { TripSchedulesService } from "#/features/trip-schedules/services/trip-schedules.service";
import type { TripScheduleAvailabilityParams } from "#/features/trip-schedules/types";

export function useTripScheduleAvailabilityQuery(
	params: TripScheduleAvailabilityParams,
) {
	return useQuery({
		queryKey: tripSchedulesQueryKeys.availability(params),
		queryFn: () => TripSchedulesService.availability(params),
		enabled: Boolean(params.scheduledAt),
	});
}
