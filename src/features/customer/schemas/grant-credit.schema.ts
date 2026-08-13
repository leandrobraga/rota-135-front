import { z } from "zod";

export const grantCreditSchema = z.object({
	amount: z.preprocess(
		(value) =>
			typeof value === "string" ? Number(value.replace(",", ".")) : value,
		z
			.number({ error: "Informe um valor" })
			.positive("Informe um valor maior que zero"),
	),
	reason: z.string().trim().min(1, "Informe o motivo"),
});

export type GrantCreditFormData = z.infer<typeof grantCreditSchema>;
