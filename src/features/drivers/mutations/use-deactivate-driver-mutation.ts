import { useMutation, useQueryClient } from "@tanstack/react-query";

import { driversQueryKeys } from "#/features/drivers/queries/use-drivers-query";
import { DriversService } from "#/features/drivers/services/drivers.service";
import { toast } from "#/lib/toast";

export function useDeactivateDriverMutation(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => DriversService.deactivate(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: driversQueryKeys.all });
			toast.success("Motorista desativado");
		},
	});
}
