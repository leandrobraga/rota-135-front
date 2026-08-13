import type { Trip } from "#/features/trips/types";

export function TripBookingTypeBadge({
	bookingType,
}: {
	bookingType: Trip["bookingType"];
}) {
	if (bookingType !== "URGENT") return null;

	return (
		<span className="rounded-full bg-[#F1E6CC] px-2.5 py-1 font-bold text-[#9C4A3E] text-[11.5px]">
			Urgente
		</span>
	);
}
