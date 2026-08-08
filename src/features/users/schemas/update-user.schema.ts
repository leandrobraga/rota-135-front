import { z } from "zod";

export const updateUserSchema = z.object({
	name: z
		.string()
		.trim()
		.optional()
		.transform((v) => (v === "" ? undefined : v))
		.refine((v) => v === undefined || v.length > 0, "Informe o nome"),
	role: z.enum(["ADMIN", "OPERATOR", "FINANCE"]).optional(),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
