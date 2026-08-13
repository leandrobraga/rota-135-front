import { useMutation, useQueryClient } from "@tanstack/react-query";

import { customerQueryKeys } from "#/features/customer/queries/use-customer-query";
import { CustomerService } from "#/features/customer/services/customer.service";
import { toast } from "#/lib/toast";

export function useDeleteCreditMutation(customerId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (creditId: string) =>
			CustomerService.deleteCredit(customerId, creditId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: customerQueryKeys.credits(customerId),
			});
			toast.success("Crédito excluído");
		},
	});
}
