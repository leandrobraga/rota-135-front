import { useQuery } from "@tanstack/react-query";

import { tripSchedulesQueryKeys } from "#/features/trip-schedules/queries/use-trip-schedule-by-id-query";
import { TripSchedulesService } from "#/features/trip-schedules/services/trip-schedules.service";
import type { ListTripSchedulesParams } from "#/features/trip-schedules/types";

export function useTripSchedulesQuery(params: ListTripSchedulesParams = {}) {
	return useQuery({
		queryKey: tripSchedulesQueryKeys.list(params),
		queryFn: () => TripSchedulesService.list(params),
	});
}
