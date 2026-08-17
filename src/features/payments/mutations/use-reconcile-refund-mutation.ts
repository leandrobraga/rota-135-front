import { useMutation, useQueryClient } from "@tanstack/react-query";

import { refundsQueryKeys } from "#/features/payments/queries/use-pending-refunds-query";
import { PaymentsService } from "#/features/payments/services/payments.service";
import { toast } from "#/lib/toast";

export function useReconcileRefundMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => PaymentsService.reconcileRefund(id),
		onSuccess: (refund) => {
			queryClient.invalidateQueries({ queryKey: refundsQueryKeys.all });
			if (refund.status === "COMPLETED") {
				toast.success("Reembolso concluído");
			} else if (refund.status === "FAILED") {
				toast.error("Reembolso falhou");
			} else {
				toast.info("Reembolso continua pendente");
			}
		},
	});
}
