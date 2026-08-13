import { useQuery } from "@tanstack/react-query";

import { tripsQueryKeys } from "#/features/trips/queries/use-trips-query";
import { TripsService } from "#/features/trips/services/trips.service";

function isValidScheduledAt(scheduledAt: string | undefined): boolean {
	if (!scheduledAt) return false;
	return !Number.isNaN(Date.parse(scheduledAt));
}

export function useTripAvailabilityQuery(
	scheduledAt: string | undefined,
	excludeTripId?: string,
) {
	return useQuery({
		queryKey: tripsQueryKeys.availability(scheduledAt ?? "", excludeTripId),
		queryFn: () =>
			TripsService.availability(scheduledAt as string, excludeTripId),
		enabled: isValidScheduledAt(scheduledAt),
	});
}
