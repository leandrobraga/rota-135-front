import { z } from "zod";

export const createTripForStaffSchema = z.object({
	clientId: z.string().min(1, "Selecione o cliente"),
	tripScheduleId: z.string().min(1, "Selecione um horário"),
	occupancyType: z.enum(["SEAT", "FULL_CAR"], {
		error: "Selecione o tipo de ocupação",
	}),
	pickupAddress: z.string().min(1, "Informe o endereço de embarque"),
	dropoffAddress: z.string().min(1, "Informe o endereço de desembarque"),
	creditIds: z.array(z.string()).optional(),
});

export type CreateTripForStaffFormData = z.infer<
	typeof createTripForStaffSchema
>;
