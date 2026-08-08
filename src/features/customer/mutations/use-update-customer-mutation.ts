import { useMutation, useQueryClient } from "@tanstack/react-query";

import { customerQueryKeys } from "#/features/customer/queries/use-customer-query";
import { CustomerService } from "#/features/customer/services/customer.service";
import type { UpdateCustomerInput } from "#/features/customer/types";
import { toast } from "#/lib/toast";

export function useUpdateCustomerMutation(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateCustomerInput) => CustomerService.update(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: customerQueryKeys.all });
			toast.success("Cliente atualizado");
		},
	});
}
