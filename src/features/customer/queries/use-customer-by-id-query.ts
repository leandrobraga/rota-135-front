import { useQuery } from "@tanstack/react-query";

import { customerQueryKeys } from "#/features/customer/queries/use-customer-query";
import { CustomerService } from "#/features/customer/services/customer.service";

export function useCustomerByIdQuery(id: string) {
	return useQuery({
		queryKey: customerQueryKeys.detail(id),
		queryFn: () => CustomerService.getById(id),
		enabled: Boolean(id),
	});
}
