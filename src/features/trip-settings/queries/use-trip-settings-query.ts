import { useQuery } from "@tanstack/react-query";

import { TripSettingsService } from "#/features/trip-settings/services/trip-settings.service";

export const tripSettingsQueryKeys = {
	all: ["trip-settings"] as const,
};

export function useTripSettingsQuery() {
	return useQuery({
		queryKey: tripSettingsQueryKeys.all,
		queryFn: () => TripSettingsService.get(),
	});
}
