import { z } from "zod";
import { toIsoDatetime } from "#/lib/datetime";

export const createTripSchema = z.object({
	occupancyType: z.enum(["SEAT", "FULL_CAR"], {
		error: "Selecione o tipo de ocupação",
	}),
	pickupAddress: z.string().min(1, "Informe o endereço de embarque"),
	dropoffAddress: z.string().min(1, "Informe o endereço de desembarque"),
	scheduledAt: z
		.string()
		.min(1, "Selecione data e horário")
		.refine((v) => !Number.isNaN(Date.parse(v)), "Data inválida")
		.refine((v) => Date.parse(v) > Date.now(), "Data deve ser no futuro")
		.transform((value) => toIsoDatetime(value) ?? value),
	clientId: z
		.string()
		.trim()
		.optional()
		.transform((v) => (v === "" ? undefined : v)),
});

export type CreateTripFormData = z.infer<typeof createTripSchema>;
