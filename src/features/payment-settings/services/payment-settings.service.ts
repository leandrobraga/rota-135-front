import type {
	PaymentSettings,
	UpdatePaymentSettingsInput,
} from "#/features/payment-settings/types";
import { typedApi } from "#/lib/api-client/typed-client";

export const PaymentSettingsService = {
	get: async (): Promise<PaymentSettings> => {
		const { data } = await typedApi.get("/payment-settings/");
		return data;
	},

	update: async (
		body: UpdatePaymentSettingsInput,
	): Promise<PaymentSettings> => {
		const { data } = await typedApi.patch("/payment-settings/", {
			json: body,
		});
		return data;
	},
};
