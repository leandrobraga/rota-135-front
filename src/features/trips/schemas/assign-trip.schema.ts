import { z } from "zod";

export const assignTripSchema = z.object({
	driverId: z.string().min(1, "Selecione o motorista"),
	vehicleId: z.string().min(1, "Selecione o veículo"),
});

export type AssignTripFormData = z.infer<typeof assignTripSchema>;
