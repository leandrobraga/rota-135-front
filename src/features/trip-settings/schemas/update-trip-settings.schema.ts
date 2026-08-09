import { z } from "zod";

const positiveNumber = (message: string) => z.coerce.number().positive(message);

export const updateTripSettingsSchema = z.object({
	urgentThresholdHours: positiveNumber(
		"Limiar de urgência deve ser maior que zero",
	),
	scheduleConflictWindowHours: positiveNumber(
		"Janela de conflito de agenda deve ser maior que zero",
	),
	clientNoShowMinutes: positiveNumber(
		"Tempo de no-show do cliente deve ser maior que zero",
	),
	driverNoShowMinutes: positiveNumber(
		"Tempo de no-show do motorista deve ser maior que zero",
	),
	skipPickupConfirmationMinutes: positiveNumber(
		"Tempo de pular confirmação de embarque deve ser maior que zero",
	),
	skipDropoffConfirmationMinutes: positiveNumber(
		"Tempo de pular confirmação de desembarque deve ser maior que zero",
	),
	fullRefundWindowHours: positiveNumber(
		"Janela de reembolso total deve ser maior que zero",
	),
	partialRefundWindowHours: positiveNumber(
		"Janela de reembolso parcial deve ser maior que zero",
	),
	reminderWindowHours: positiveNumber(
		"Janela de lembrete deve ser maior que zero",
	),
});

export type UpdateTripSettingsFormData = z.infer<
	typeof updateTripSettingsSchema
>;
