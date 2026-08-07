import { useQuery } from "@tanstack/react-query";

import { CustomerService } from "#/features/customer/services/customer.service";
import type { ListCustomerParams } from "#/features/customer/types";

export const customerQueryKeys = {
	all: ["customer"] as const,
	list: (params: ListCustomerParams) =>
		[...customerQueryKeys.all, "list", params] as const,
	detail: (id: string) => [...customerQueryKeys.all, "detail", id] as const,
};

export function useCustomerQuery(params: ListCustomerParams = {}) {
	return useQuery({
		queryKey: customerQueryKeys.list(params),
		queryFn: () => CustomerService.list(params),
	});
}
