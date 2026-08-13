import { useMutation, useQueryClient } from "@tanstack/react-query";

import { customerQueryKeys } from "#/features/customer/queries/use-customer-query";
import { CustomerService } from "#/features/customer/services/customer.service";
import type { GrantCreditInput } from "#/features/customer/types";
import { toast } from "#/lib/toast";

export function useGrantCreditMutation(customerId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: GrantCreditInput) =>
			CustomerService.grantCredit(customerId, body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: customerQueryKeys.credits(customerId),
			});
			toast.success("Crédito concedido");
		},
	});
}
