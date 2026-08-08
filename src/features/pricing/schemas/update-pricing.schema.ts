import { z } from "zod";

export const updatePricingSchema = z.object({
	price: z.coerce.number().positive("Preço deve ser maior que zero"),
});

export type UpdatePricingFormData = z.infer<typeof updatePricingSchema>;
