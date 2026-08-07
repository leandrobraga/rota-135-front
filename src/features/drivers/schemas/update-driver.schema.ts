import { z } from "zod";

import { isValidCpf } from "#/features/drivers/schemas/cpf";

const optionalText = (message: string) =>
	z
		.string()
		.trim()
		.optional()
		.transform((v) => (v === "" ? undefined : v))
		.refine((v) => v === undefined || v.length > 0, message);

export const updateDriverSchema = z.object({
	name: optionalText("Informe o nome"),
	email: z
		.string()
		.trim()
		.optional()
		.transform((v) => (v === "" ? undefined : v))
		.refine(
			(v) => v === undefined || z.email().safeParse(v).success,
			"Informe um email válido",
		),
	phone: optionalText("Informe o telefone"),
	cpf: z
		.string()
		.trim()
		.optional()
		.transform((v) => (v === "" ? undefined : v))
		.refine((v) => v === undefined || isValidCpf(v), "CPF inválido"),
	licenseNumber: optionalText("Informe o número da habilitação"),
	pixKey: z
		.string()
		.trim()
		.optional()
		.transform((v) => (v === "" ? undefined : v)),
});

export type UpdateDriverFormData = z.infer<typeof updateDriverSchema>;
