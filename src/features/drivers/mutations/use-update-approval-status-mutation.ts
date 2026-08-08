import { useMutation, useQueryClient } from "@tanstack/react-query";

import { driversQueryKeys } from "#/features/drivers/queries/use-drivers-query";
import { DriversService } from "#/features/drivers/services/drivers.service";
import type { DriverApprovalStatus } from "#/features/drivers/types";
import { toast } from "#/lib/toast";

const APPROVAL_STATUS_LABEL: Record<DriverApprovalStatus, string> = {
	PENDING: "Pendente",
	APPROVED: "Aprovado",
	REJECTED: "Rejeitado",
	SUSPENDED: "Suspenso",
};

export function useUpdateApprovalStatusMutation(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (approvalStatus: DriverApprovalStatus) =>
			DriversService.updateApprovalStatus(id, approvalStatus),
		onSuccess: (driver) => {
			queryClient.invalidateQueries({ queryKey: driversQueryKeys.all });
			toast.success(
				`Status atualizado para ${APPROVAL_STATUS_LABEL[driver.approvalStatus]}`,
			);
		},
	});
}
