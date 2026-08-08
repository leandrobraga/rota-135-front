import { z } from "zod";

export const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Informe a senha atual"),
		newPassword: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
		confirmNewPassword: z.string().min(1, "Confirme a nova senha"),
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "As senhas não coincidem",
		path: ["confirmNewPassword"],
	});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
