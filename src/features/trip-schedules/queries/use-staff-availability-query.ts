import { useQuery } from "@tanstack/react-query";

import { tripSchedulesQueryKeys } from "#/features/trip-schedules/queries/use-trip-schedule-by-id-query";
import { TripSchedulesService } from "#/features/trip-schedules/services/trip-schedules.service";
import type { StaffAvailabilityParams } from "#/features/trip-schedules/types";

export function useStaffAvailabilityQuery(params: StaffAvailabilityParams) {
	return useQuery({
		queryKey: tripSchedulesQueryKeys.staffAvailability(params),
		queryFn: () => TripSchedulesService.staffAvailability(params),
		enabled: Boolean(params.date) && Boolean(params.direction),
	});
}
