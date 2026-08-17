import { useQuery } from "@tanstack/react-query";

import { PaymentsService } from "#/features/payments/services/payments.service";

export const paymentsQueryKeys = {
	all: ["payments"] as const,
	pending: () => [...paymentsQueryKeys.all, "pending"] as const,
};

export function usePendingPaymentsQuery() {
	return useQuery({
		queryKey: paymentsQueryKeys.pending(),
		queryFn: () => PaymentsService.listPendingPayments(),
	});
}
