import { useMutation, useQueryClient } from "@tanstack/react-query";

import { driversQueryKeys } from "#/features/drivers/queries/use-drivers-query";
import { DriversService } from "#/features/drivers/services/drivers.service";
import type { DriverApprovalStatus } from "#/features/drivers/types";

export function useUpdateApprovalStatusMutation(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (approvalStatus: DriverApprovalStatus) =>
			DriversService.updateApprovalStatus(id, approvalStatus),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: driversQueryKeys.all });
		},
	});
}
