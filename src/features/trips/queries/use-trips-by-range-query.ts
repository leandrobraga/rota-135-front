import { useQuery } from "@tanstack/react-query";

import { tripsQueryKeys } from "#/features/trips/queries/use-trips-query";
import { TripsService } from "#/features/trips/services/trips.service";

export function useTripsByDateRangeQuery({
	from,
	to,
}: {
	from: string;
	to: string;
}) {
	return useQuery({
		queryKey: tripsQueryKeys.range(from, to),
		queryFn: () => TripsService.listByDateRange(from, to),
		enabled: Boolean(from) && Boolean(to),
	});
}
