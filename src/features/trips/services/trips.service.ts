import type {
	AssignTripInput,
	CancelTripInput,
	CreateTripInput,
	CreateTripResponse,
	ListTripsParams,
	Trip,
	TripAvailability,
	TripsListResponse,
} from "#/features/trips/types";
import { typedApi } from "#/lib/api-client/typed-client";

export const TripsService = {
	list: async (params: ListTripsParams = {}): Promise<TripsListResponse> => {
		const { data } = await typedApi.get("/trips/", {
			params: { query: params },
		});
		return data;
	},

	getById: async (id: string): Promise<Trip> => {
		const { data } = await typedApi.get("/trips/{id}", {
			params: { path: { id } },
		});
		return data as Trip;
	},

	create: async (body: CreateTripInput): Promise<CreateTripResponse> => {
		const { data } = await typedApi.post("/trips/", { json: body });
		return data as CreateTripResponse;
	},

	assign: async (id: string, body: AssignTripInput): Promise<Trip> => {
		const { data } = await typedApi.patch("/trips/{id}/assign", {
			params: { path: { id } },
			json: body,
		});
		return data as Trip;
	},

	cancel: async (id: string, body: CancelTripInput): Promise<Trip> => {
		const { data } = await typedApi.patch("/trips/{id}/cancel", {
			params: { path: { id } },
			json: body,
		});
		return data as Trip;
	},

	availability: async (
		scheduledAt: string,
		excludeTripId?: string,
	): Promise<TripAvailability> => {
		const { data } = await typedApi.get("/trips/availability", {
			params: { query: { scheduledAt, excludeTripId } },
		});
		return data;
	},
};
