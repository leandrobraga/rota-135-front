import { useQuery } from "@tanstack/react-query";

import { PricingService } from "#/features/pricing/services/pricing.service";

export const pricingQueryKeys = {
	all: ["pricing"] as const,
	list: () => [...pricingQueryKeys.all, "list"] as const,
};

export function usePricingQuery() {
	return useQuery({
		queryKey: pricingQueryKeys.list(),
		queryFn: () => PricingService.list(),
	});
}
