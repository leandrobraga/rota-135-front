import { useQuery } from "@tanstack/react-query";

import { customerQueryKeys } from "#/features/customer/queries/use-customer-query";
import { CustomerService } from "#/features/customer/services/customer.service";

export function useCustomerCreditsQuery(customerId: string) {
	return useQuery({
		queryKey: customerQueryKeys.credits(customerId),
		queryFn: () => CustomerService.listCredits(customerId),
		enabled: Boolean(customerId),
	});
}
