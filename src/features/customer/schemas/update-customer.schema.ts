import { z } from "zod";

const optionalText = (message: string) =>
	z
		.string()
		.trim()
		.optional()
		.transform((v) => (v === "" ? undefined : v))
		.refine((v) => v === undefined || v.length > 0, message);

export const updateCustomerSchema = z.object({
	name: optionalText("Informe o nome"),
	phone: optionalText("Informe o telefone"),
	emergencyContactName: optionalText("Informe o nome do contato de emergência"),
	emergencyContactPhone: optionalText(
		"Informe o telefone do contato de emergência",
	),
});

export type UpdateCustomerFormData = z.infer<typeof updateCustomerSchema>;
