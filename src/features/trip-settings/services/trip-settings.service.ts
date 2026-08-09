import type {
	TripSettings,
	UpdateTripSettingsInput,
} from "#/features/trip-settings/types";
import { typedApi } from "#/lib/api-client/typed-client";

export const TripSettingsService = {
	get: async (): Promise<TripSettings> => {
		const { data } = await typedApi.get("/trip-settings/");
		return data;
	},

	update: async (body: UpdateTripSettingsInput): Promise<TripSettings> => {
		const { data } = await typedApi.patch("/trip-settings/", { json: body });
		return data;
	},
};
