import { useMutation, useQueryClient } from "@tanstack/react-query";

import { driversQueryKeys } from "#/features/drivers/queries/use-drivers-query";
import { DriversService } from "#/features/drivers/services/drivers.service";

export function useActivateDriverMutation(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => DriversService.activate(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: driversQueryKeys.all });
		},
	});
}
