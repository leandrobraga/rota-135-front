import type { operations } from "#/lib/api-client/schema.d.ts";
import type { ApiResponse } from "#/lib/api-client/typed-client";

type RawVehicle = ApiResponse<"getVehiclesById">;

// createdAt/updatedAt vêm unknown do gerador (z.date() não representável em
// JSON Schema) — sabemos que o valor real de fio é string ISO.
export type Vehicle = Omit<RawVehicle, "createdAt" | "updatedAt"> & {
	createdAt: string;
	updatedAt: string;
};

export type VehiclesListResponse = ApiResponse<"getVehicles">;

// Shape de referência pros schemas Zod de input — não precisa ser idêntico,
// só consistente com o que o backend espera no body.
export type CreateVehicleInput =
	operations["postVehicles"]["requestBody"]["content"]["application/json"];

export type UpdateVehicleInput =
	operations["patchVehiclesById"]["requestBody"]["content"]["application/json"];

export type ListVehiclesParams = NonNullable<
	operations["getVehicles"]["parameters"]["query"]
>;
