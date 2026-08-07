import { z } from "zod";

export const createVehicleSchema = z.object({
	plate: z
		.string()
		.min(1, "Informe a placa")
		.regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, "Placa inválida"),
	brand: z.string().min(1, "Informe a marca"),
	model: z.string().min(1, "Informe o modelo"),
	year: z.coerce.number().int().min(1900, "Ano inválido"),
	capacity: z.coerce.number().positive("Capacidade deve ser maior que zero"),
	color: z
		.string()
		.trim()
		.optional()
		.transform((v) => (v === "" ? undefined : v)),
});

export type CreateVehicleFormData = z.infer<typeof createVehicleSchema>;
