import { z } from "zod";

export const resetPasswordSchema = z
	.object({
		newPassword: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
		confirmPassword: z.string().min(1, "Confirme a senha"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
