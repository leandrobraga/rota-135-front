import type {
	CreateVehicleInput,
	ListVehiclesParams,
	UpdateVehicleInput,
	Vehicle,
	VehiclesListResponse,
} from "#/features/vehicles/types";
import { typedApi } from "#/lib/api-client/typed-client";

export const VehiclesService = {
	list: async (
		params: ListVehiclesParams = {},
	): Promise<VehiclesListResponse> => {
		const { data } = await typedApi.get("/vehicles/", {
			params: { query: params },
		});
		return data;
	},

	getById: async (id: string): Promise<Vehicle> => {
		const { data } = await typedApi.get("/vehicles/{id}", {
			params: { path: { id } },
		});
		return data as Vehicle;
	},

	create: async (body: CreateVehicleInput): Promise<Vehicle> => {
		const { data } = await typedApi.post("/vehicles/", { json: body });
		return data as Vehicle;
	},

	update: async (id: string, body: UpdateVehicleInput): Promise<Vehicle> => {
		const { data } = await typedApi.patch("/vehicles/{id}", {
			params: { path: { id } },
			json: body,
		});
		return data as Vehicle;
	},

	deactivate: async (id: string): Promise<Vehicle> => {
		const { data } = await typedApi.patch("/vehicles/{id}/deactivate", {
			params: { path: { id } },
		});
		return data as Vehicle;
	},

	activate: async (id: string): Promise<Vehicle> => {
		const { data } = await typedApi.patch("/vehicles/{id}/activate", {
			params: { path: { id } },
		});
		return data as Vehicle;
	},
};
