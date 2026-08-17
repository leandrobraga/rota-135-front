import { useMutation, useQueryClient } from "@tanstack/react-query";

import { paymentSettingsQueryKeys } from "#/features/payment-settings/queries/use-payment-settings-query";
import { PaymentSettingsService } from "#/features/payment-settings/services/payment-settings.service";
import type { UpdatePaymentSettingsInput } from "#/features/payment-settings/types";
import { toast } from "#/lib/toast";

export function useUpdatePaymentSettingsMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdatePaymentSettingsInput) =>
			PaymentSettingsService.update(body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: paymentSettingsQueryKeys.all,
			});
			toast.success("Configurações atualizadas");
		},
	});
}
