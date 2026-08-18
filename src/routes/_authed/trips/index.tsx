import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CreateTripForStaffDialog } from "#/features/trips/components/CreateTripForStaffDialog";
import { TripsList } from "#/features/trips/components/TripsList";
import { requireRole } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/trips/")({
	beforeLoad: ({ location }) =>
		requireRole(location.href, ["ADMIN", "OPERATOR"]),
	component: TripsPage,
});

function TripsPage() {
	const [creating, setCreating] = useState(false);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h1 className="font-display font-bold text-[22px] text-navy-800">
					Corridas
				</h1>
				<button
					type="button"
					onClick={() => setCreating(true)}
					className="h-11 rounded-[10px] bg-gold-500 px-5 font-bold text-[14px] text-navy-800"
				>
					+ Nova corrida
				</button>
			</div>

			<TripsList />

			<CreateTripForStaffDialog open={creating} onOpenChange={setCreating} />
		</div>
	);
}
