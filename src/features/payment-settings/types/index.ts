import type { operations } from "#/lib/api-client/schema.d.ts";
import type { ApiResponse } from "#/lib/api-client/typed-client";

export type PaymentSettings = ApiResponse<"getPayment-settings">;

export type UpdatePaymentSettingsInput =
	operations["patchPayment-settings"]["requestBody"]["content"]["application/json"];
