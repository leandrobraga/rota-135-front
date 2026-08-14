import { z } from "zod";
import { createTripSchema } from "#/features/trips/schemas/create-trip.schema";

export const createTripForStaffSchema = createTripSchema.extend({
	clientId: z.string().min(1, "Selecione o cliente"),
	vehicleId: z.string().min(1, "Selecione o veículo"),
	creditIds: z.array(z.string()).optional(),
});

export type CreateTripForStaffFormData = z.infer<
	typeof createTripForStaffSchema
>;
