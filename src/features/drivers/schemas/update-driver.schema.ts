import { z } from "zod";

const optionalText = (message: string) =>
	z
		.string()
		.trim()
		.optional()
		.transform((v) => (v === "" ? undefined : v))
		.refine((v) => v === undefined || v.length > 0, message);

export const updateDriverSchema = z.object({
	name: optionalText("Informe o nome"),
	phone: optionalText("Informe o telefone"),
	licenseNumber: optionalText("Informe o número da habilitação"),
	pixKey: z
		.string()
		.trim()
		.optional()
		.transform((v) => (v === "" ? undefined : v)),
});

export type UpdateDriverFormData = z.infer<typeof updateDriverSchema>;
