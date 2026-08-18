import type { ApiResponse } from "#/lib/api-client/typed-client";

type RawTripSchedule = ApiResponse<"getTrip-schedulesById">;

// scheduledAt/cancelledAt/createdAt/updatedAt vêm unknown do gerador
// (Date não representável em JSON Schema) — sabemos que o valor real de
// fio é string ISO.
export type TripSchedule = Omit<
	RawTripSchedule,
	"scheduledAt" | "cancelledAt" | "createdAt" | "updatedAt"
> & {
	scheduledAt: string;
	cancelledAt: string | null;
	createdAt: string;
	updatedAt: string;
};
