import { useQuery } from "@tanstack/react-query";

import { PaymentSettingsService } from "#/features/payment-settings/services/payment-settings.service";

export const paymentSettingsQueryKeys = {
	all: ["payment-settings"] as const,
};

export function usePaymentSettingsQuery() {
	return useQuery({
		queryKey: paymentSettingsQueryKeys.all,
		queryFn: () => PaymentSettingsService.get(),
	});
}
