import { useMutation, useQueryClient } from "@tanstack/react-query";

import { paymentsQueryKeys } from "#/features/payments/queries/use-pending-payments-query";
import { PaymentsService } from "#/features/payments/services/payments.service";
import { toast } from "#/lib/toast";

export function useReconcilePaymentMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => PaymentsService.reconcilePayment(id),
		onSuccess: (payment) => {
			queryClient.invalidateQueries({ queryKey: paymentsQueryKeys.all });
			if (payment.status === "PAID") {
				toast.success("Pagamento confirmado");
			} else if (payment.status === "FAILED") {
				toast.error("Pagamento falhou");
			} else {
				toast.info("Pagamento continua pendente");
			}
		},
	});
}
