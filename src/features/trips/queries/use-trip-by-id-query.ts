import { useQuery } from "@tanstack/react-query";

import { tripsQueryKeys } from "#/features/trips/queries/use-trips-query";
import { TripsService } from "#/features/trips/services/trips.service";
import type { Trip, TripStatus } from "#/features/trips/types";

const LIVE_STATUSES: TripStatus[] = [
	"AWAITING_BOARDING",
	"IN_PROGRESS",
	"AWAITING_DROPOFF",
];

export function isLiveTripStatus(status: TripStatus): boolean {
	return LIVE_STATUSES.includes(status);
}

export function useTripByIdQuery(id: string) {
	return useQuery({
		queryKey: tripsQueryKeys.detail(id),
		queryFn: () => TripsService.getById(id),
		enabled: Boolean(id),
		refetchInterval: (query) => {
			const trip = query.state.data as Trip | undefined;
			return trip && isLiveTripStatus(trip.status) ? 15000 : false;
		},
		refetchIntervalInBackground: false,
	});
}
