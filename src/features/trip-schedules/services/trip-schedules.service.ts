import type { TripSchedule } from "#/features/trip-schedules/types";
import { typedApi } from "#/lib/api-client/typed-client";

export const TripSchedulesService = {
	getById: async (id: string): Promise<TripSchedule> => {
		const { data } = await typedApi.get("/trip-schedules/{id}", {
			params: { path: { id } },
		});
		return data as TripSchedule;
	},
};
