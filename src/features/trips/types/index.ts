import type { operations } from "#/lib/api-client/schema.d.ts";
import type { ApiResponse } from "#/lib/api-client/typed-client";

type RawTrip = ApiResponse<"getTripsById">;
type RawTripCheckpoint = NonNullable<RawTrip["checkpoint"]>;
type RawTripRefund = NonNullable<RawTrip["refund"]>;

type TripRefund = Omit<RawTripRefund, "amount"> & {
	amount: string;
};

// scheduledAt/cancelledAt/reminderSentAt/createdAt/updatedAt/price vêm
// unknown do gerador (Date/Decimal não representável em JSON Schema) —
// sabemos que o valor real de fio é string ISO / string numérica.
type TripCheckpoint = Omit<
	RawTripCheckpoint,
	| "driverArrivedPickupAt"
	| "clientConfirmedPickupAt"
	| "driverArrivedDropoffAt"
	| "clientConfirmedDropoffAt"
	| "createdAt"
	| "updatedAt"
> & {
	driverArrivedPickupAt: string | null;
	clientConfirmedPickupAt: string | null;
	driverArrivedDropoffAt: string | null;
	clientConfirmedDropoffAt: string | null;
	createdAt: string;
	updatedAt: string;
};

export type Trip = Omit<
	RawTrip,
	| "price"
	| "scheduledAt"
	| "cancelledAt"
	| "reminderSentAt"
	| "createdAt"
	| "updatedAt"
	| "checkpoint"
	| "refund"
> & {
	price: string;
	scheduledAt: string;
	cancelledAt: string | null;
	reminderSentAt: string | null;
	createdAt: string;
	updatedAt: string;
	checkpoint: TripCheckpoint | null;
	refund: TripRefund | null;
};

export type TripStatus = Trip["status"];

export type TripsListResponse = ApiResponse<"getTrips">;

// Shape de referência pros schemas Zod de input — não precisa ser idêntico,
// só consistente com o que o backend espera no body.
export type CreateTripInput =
	operations["postTrips"]["requestBody"]["content"]["application/json"];

export type CancelTripInput =
	operations["patchTripsByIdCancel"]["requestBody"]["content"]["application/json"];

export type ListTripsParams = NonNullable<
	operations["getTrips"]["parameters"]["query"]
>;

type RawCreateTripResponse = ApiResponse<"postTrips">;

export type CreateTripResponse = Omit<RawCreateTripResponse, "trip"> & {
	trip: Omit<RawCreateTripResponse["trip"], "price" | "scheduledAt"> & {
		price: string;
		scheduledAt: string;
	};
};
