import { z } from "zod";

import { isValidCpf } from "#/lib/validators";

export const createUserSchema = z
	.object({
		name: z.string().min(1, "Informe o nome"),
		email: z.email("Informe um email válido"),
		password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
		confirmPassword: z.string().min(1, "Confirme a senha"),
		cpf: z.string().refine(isValidCpf, "CPF inválido"),
		role: z.enum(["ADMIN", "OPERATOR", "FINANCE"]),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
