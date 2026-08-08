import type { ApiResponse } from "#/lib/api-client/typed-client";

type RawPricing = ApiResponse<"getPricing">[number];

// price vem unknown do gerador (Decimal não representável em JSON Schema).
// Não sabemos se o fio manda number ou string — aceita as duas até
// confirmar com um payload real.
export type Pricing = Omit<RawPricing, "price"> & {
	price: string | number;
};
