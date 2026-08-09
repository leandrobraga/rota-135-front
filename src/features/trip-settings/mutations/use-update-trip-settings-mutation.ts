import { useMutation, useQueryClient } from "@tanstack/react-query";

import { tripSettingsQueryKeys } from "#/features/trip-settings/queries/use-trip-settings-query";
import { TripSettingsService } from "#/features/trip-settings/services/trip-settings.service";
import type { UpdateTripSettingsInput } from "#/features/trip-settings/types";
import { toast } from "#/lib/toast";

export function useUpdateTripSettingsMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateTripSettingsInput) =>
			TripSettingsService.update(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: tripSettingsQueryKeys.all });
			toast.success("Configurações atualizadas");
		},
	});
}
