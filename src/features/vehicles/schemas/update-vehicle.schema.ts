import { z } from "zod";

const optionalText = (message: string) =>
	z
		.string()
		.trim()
		.optional()
		.transform((v) => (v === "" ? undefined : v))
		.refine((v) => v === undefined || v.length > 0, message);

export const updateVehicleSchema = z.object({
	plate: optionalText("Informe a placa"),
	brand: optionalText("Informe a marca"),
	model: optionalText("Informe o modelo"),
	year: z.coerce.number().int().min(1900, "Ano inválido").optional(),
	capacity: z.coerce
		.number()
		.positive("Capacidade deve ser maior que zero")
		.optional(),
	color: z
		.string()
		.trim()
		.optional()
		.transform((v) => (v === "" ? undefined : v)),
});

export type UpdateVehicleFormData = z.infer<typeof updateVehicleSchema>;
