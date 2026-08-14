import { z } from "zod";

import { isValidCpf } from "#/lib/validators";

function isValidCnpjFormat(value: string): boolean {
	return value.replace(/[^\dA-Za-z]/g, "").length === 14;
}

// Obrigatoriedade condicional (choice exigido quando reembolso elegível,
// pixKey/pixKeyType exigidos quando choice=REFUND parcial) é validada no
// backend — schema aqui só tipa o formato. Validação de formato por tipo de
// chave roda via superRefine porque depende de dois campos ao mesmo tempo.
export const cancelTripSchema = z
	.object({
		choice: z.enum(["REFUND", "CREDIT"]).optional(),
		pixKey: z
			.string()
			.trim()
			.optional()
			.transform((v) => (v === "" ? undefined : v)),
		pixKeyType: z
			.enum(["CPF", "CNPJ", "PHONE", "EMAIL", "RANDOM", "BR_CODE"])
			.optional(),
	})
	.superRefine((data, ctx) => {
		if (!data.pixKey || !data.pixKeyType) return;

		if (data.pixKeyType === "CPF" && !isValidCpf(data.pixKey)) {
			ctx.addIssue({
				code: "custom",
				path: ["pixKey"],
				message: "CPF inválido",
			});
		}

		// Sem dígito verificador por enquanto (CNPJ alfanumérico, formato novo
		// desde jul/2026) — só checa tamanho. Melhoria futura.
		if (data.pixKeyType === "CNPJ" && !isValidCnpjFormat(data.pixKey)) {
			ctx.addIssue({
				code: "custom",
				path: ["pixKey"],
				message: "CNPJ inválido",
			});
		}

		if (
			data.pixKeyType === "EMAIL" &&
			!z.email().safeParse(data.pixKey).success
		) {
			ctx.addIssue({
				code: "custom",
				path: ["pixKey"],
				message: "E-mail inválido",
			});
		}
	});

export type CancelTripFormData = z.infer<typeof cancelTripSchema>;
