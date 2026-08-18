import type {
	CancelTripInput,
	CreateTripInput,
	CreateTripResponse,
	ListTripsParams,
	Trip,
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

	listByDateRange: async (
		from: string,
		to: string,
	): Promise<TripsListResponse> => {
		const { data } = await typedApi.get("/trips/", {
			params: { query: { from, to, pageSize: 500 } },
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

	cancel: async (id: string, body: CancelTripInput): Promise<Trip> => {
		const { data } = await typedApi.patch("/trips/{id}/cancel", {
			params: { path: { id } },
			json: body,
		});
		return data as Trip;
	},
};
