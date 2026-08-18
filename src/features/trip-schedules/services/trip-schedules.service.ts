import type {
	CreateTripScheduleInput,
	CreateTripScheduleResponse,
	ListTripSchedulesParams,
	StaffAvailabilityParams,
	StaffAvailabilitySlot,
	TripSchedule,
	TripScheduleAvailability,
	TripScheduleAvailabilityParams,
	TripSchedulesListResponse,
	UpdateTripScheduleInput,
	UpdateTripScheduleResponse,
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

	availability: async (
		params: TripScheduleAvailabilityParams,
	): Promise<TripScheduleAvailability> => {
		const { data } = await typedApi.get("/trip-schedules/availability", {
			params: { query: params },
		});
		return data as TripScheduleAvailability;
	},

	create: async (
		body: CreateTripScheduleInput,
	): Promise<CreateTripScheduleResponse> => {
		const { data } = await typedApi.post("/trip-schedules/", { json: body });
		return data as CreateTripScheduleResponse;
	},

	update: async (
		id: string,
		body: UpdateTripScheduleInput,
	): Promise<UpdateTripScheduleResponse> => {
		const { data } = await typedApi.patch("/trip-schedules/{id}", {
			params: { path: { id } },
			json: body,
		});
		return data as UpdateTripScheduleResponse;
	},

	cancel: async (id: string): Promise<void> => {
		await typedApi.post("/trip-schedules/{id}/cancel", {
			params: { path: { id } },
		});
	},
};
