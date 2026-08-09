import type { operations } from "#/lib/api-client/schema.d.ts";
import type { ApiResponse } from "#/lib/api-client/typed-client";

export type TripSettings = ApiResponse<"getTrip-settings">;

export type UpdateTripSettingsInput =
	operations["patchTrip-settings"]["requestBody"]["content"]["application/json"];
