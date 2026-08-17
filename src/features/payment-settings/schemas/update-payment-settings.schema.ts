import { z } from "zod";

const positiveNumber = (message: string) => z.coerce.number().positive(message);

export const updatePaymentSettingsSchema = z.object({
	paymentPendingAlertHours: positiveNumber(
		"Limiar de alerta de pagamento pendente deve ser maior que zero",
	),
	refundPendingAlertHours: positiveNumber(
		"Limiar de alerta de reembolso pendente deve ser maior que zero",
	),
});

export type UpdatePaymentSettingsFormData = z.infer<
	typeof updatePaymentSettingsSchema
>;
