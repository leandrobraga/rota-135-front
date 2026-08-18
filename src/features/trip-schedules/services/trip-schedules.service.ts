import type {
	ListTripSchedulesParams,
	StaffAvailabilityParams,
	StaffAvailabilitySlot,
	TripSchedule,
	TripSchedulesListResponse,
} from "#/features/trip-schedules/types";
import { typedApi } from "#/lib/api-client/typed-client";

export const TripSchedulesService = {
	list: async (
		params: ListTripSchedulesParams = {},
	): Promise<TripSchedulesListResponse> => {
		const { data } = await typedApi.get("/trip-schedules/", {
			params: { query: params },
		});
		return data as TripSchedulesListResponse;
	},

	getById: async (id: string): Promise<TripSchedule> => {
		const { data } = await typedApi.get("/trip-schedules/{id}", {
			params: { path: { id } },
		});
		return data as TripSchedule;
	},

	staffAvailability: async (
		params: StaffAvailabilityParams,
	): Promise<StaffAvailabilitySlot[]> => {
		const { data } = await typedApi.get("/trip-schedules/staff-availability", {
			params: { query: params },
		});
		return data as StaffAvailabilitySlot[];
	},
};
