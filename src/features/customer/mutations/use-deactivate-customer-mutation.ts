import { useMutation, useQueryClient } from "@tanstack/react-query";

import { customerQueryKeys } from "#/features/customer/queries/use-customer-query";
import { CustomerService } from "#/features/customer/services/customer.service";
import { toast } from "#/lib/toast";

export function useDeactivateCustomerMutation(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => CustomerService.deactivate(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: customerQueryKeys.all });
			toast.success("Cliente desativado");
		},
	});
}
