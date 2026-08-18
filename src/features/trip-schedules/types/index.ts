import type { operations } from "#/lib/api-client/schema.d.ts";
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

type RawTripSchedulesListResponse = ApiResponse<"getTrip-schedules">;

export type TripSchedulesListResponse = Omit<
	RawTripSchedulesListResponse,
	"data"
> & {
	data: TripSchedule[];
};

export type ListTripSchedulesParams = NonNullable<
	operations["getTrip-schedules"]["parameters"]["query"]
>;

type RawStaffAvailabilitySlot =
	ApiResponse<"getTrip-schedulesStaff-availability">[number];

// scheduledAt/seatPrice/fullCarPrice vêm unknown do gerador (Date/Decimal
// não representável em JSON Schema) — sabemos que o valor real de fio é
// string ISO / string numérica.
export type StaffAvailabilitySlot = Omit<
	RawStaffAvailabilitySlot,
	"scheduledAt" | "seatPrice" | "fullCarPrice"
> & {
	scheduledAt: string;
	seatPrice: string;
	fullCarPrice: string;
};

export type StaffAvailabilityParams =
	operations["getTrip-schedulesStaff-availability"]["parameters"]["query"];
