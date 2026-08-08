import { useMutation, useQueryClient } from "@tanstack/react-query";

import { pricingQueryKeys } from "#/features/pricing/queries/usePricingQuery";
import { PricingService } from "#/features/pricing/services/pricing.service";

export function useUpdatePricingMutation(occupancyType: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (price: number) => PricingService.update(occupancyType, price),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: pricingQueryKeys.all });
		},
	});
}
