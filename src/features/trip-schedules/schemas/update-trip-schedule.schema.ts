import { z } from "zod";

export const updateTripScheduleSchema = z.object({
	vehicleId: z.string().optional(),
	driverId: z.string().optional(),
});

export type UpdateTripScheduleFormData = z.infer<
	typeof updateTripScheduleSchema
>;
