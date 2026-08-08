import type { Pricing } from "#/features/pricing/types";
import { typedApi } from "#/lib/api-client/typed-client";

export const PricingService = {
	list: async (): Promise<Pricing[]> => {
		const { data } = await typedApi.get("/pricing/");
		return data as Pricing[];
	},

	update: async (occupancyType: string, price: number): Promise<Pricing> => {
		const { data } = await typedApi.patch("/pricing/{occupancyType}", {
			params: { path: { occupancyType } },
			json: { price },
		});
		return data as Pricing;
	},
};
