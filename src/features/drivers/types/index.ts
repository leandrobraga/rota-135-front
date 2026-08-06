import type { operations } from "#/lib/api-client/schema.d.ts";
import type { ApiResponse } from "#/lib/api-client/typed-client";

type RawDriver = ApiResponse<"getDriversById">;

// createdAt/updatedAt vêm unknown do gerador (z.date() não representável em
// JSON Schema) — sabemos que o valor real de fio é string ISO.
export type Driver = Omit<RawDriver, "createdAt" | "updatedAt"> & {
	createdAt: string;
	updatedAt: string;
};

export type DriverApprovalStatus = Driver["approvalStatus"];

export type DriversListResponse = ApiResponse<"getDrivers">;

// Shape de referência pros schemas Zod de input — não precisa ser idêntico,
// só consistente com o que o backend espera no body.
export type CreateDriverInput =
	operations["postDrivers"]["requestBody"]["content"]["application/json"];

export type UpdateDriverInput =
	operations["patchDriversById"]["requestBody"]["content"]["application/json"];

export type ListDriversParams = NonNullable<
	operations["getDrivers"]["parameters"]["query"]
>;
