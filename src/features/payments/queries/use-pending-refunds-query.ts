import { useQuery } from "@tanstack/react-query";

import { PaymentsService } from "#/features/payments/services/payments.service";

export const refundsQueryKeys = {
	all: ["refunds"] as const,
	pending: () => [...refundsQueryKeys.all, "pending"] as const,
};

export function usePendingRefundsQuery() {
	return useQuery({
		queryKey: refundsQueryKeys.pending(),
		queryFn: () => PaymentsService.listPendingRefunds(),
	});
}
