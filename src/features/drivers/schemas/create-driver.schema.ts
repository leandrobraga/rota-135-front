import { z } from "zod";

import { isValidCpf } from "#/features/drivers/schemas/cpf";

export const createDriverSchema = z.object({
	name: z.string().min(1, "Informe o nome"),
	email: z.email("Informe um email válido"),
	phone: z.string().min(1, "Informe o telefone"),
	cpf: z.string().refine(isValidCpf, "CPF inválido"),
	licenseNumber: z.string().min(1, "Informe o número da habilitação"),
	pixKey: z
		.string()
		.trim()
		.optional()
		.transform((v) => (v === "" ? undefined : v)),
});

export type CreateDriverFormData = z.infer<typeof createDriverSchema>;
