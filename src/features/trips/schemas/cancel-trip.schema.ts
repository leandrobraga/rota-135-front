import { z } from "zod";

// Obrigatoriedade condicional (choice exigido quando reembolso elegível,
// pixKey/pixKeyType exigidos quando choice=REFUND parcial) é validada no
// backend — schema aqui só tipa o formato.
export const cancelTripSchema = z.object({
	choice: z.enum(["REFUND", "CREDIT"]).optional(),
	pixKey: z
		.string()
		.trim()
		.optional()
		.transform((v) => (v === "" ? undefined : v)),
	pixKeyType: z
		.enum(["CPF", "CNPJ", "PHONE", "EMAIL", "RANDOM", "BR_CODE"])
		.optional(),
});

export type CancelTripFormData = z.infer<typeof cancelTripSchema>;
