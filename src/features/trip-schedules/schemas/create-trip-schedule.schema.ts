import { z } from "zod";

export const createTripScheduleSchema = z.object({
	direction: z.enum(["MOC_TO_BH", "BH_TO_MOC"], {
		error: "Selecione a direção",
	}),
	scheduledAt: z.string().min(1, "Informe data e horário"),
	vehicleId: z.string().min(1, "Selecione o veículo"),
	driverId: z.string().min(1, "Selecione o motorista"),
});

export type CreateTripScheduleFormData = z.infer<
	typeof createTripScheduleSchema
>;
