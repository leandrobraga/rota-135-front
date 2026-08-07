import { useMutation, useQueryClient } from "@tanstack/react-query";

import { customerQueryKeys } from "#/features/customer/queries/use-customer-query";
import { CustomerService } from "#/features/customer/services/customer.service";

export function useActivateCustomerMutation(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => CustomerService.activate(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: customerQueryKeys.all });
		},
	});
}
