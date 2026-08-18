import { createFileRoute } from "@tanstack/react-router";
import { TripsList } from "#/features/trips/components/TripsList";
import { requireRole } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/trips/")({
	beforeLoad: ({ location }) =>
		requireRole(location.href, ["ADMIN", "OPERATOR"]),
	component: TripsPage,
});

function TripsPage() {
	return (
		<div className="flex flex-col gap-6">
			<h1 className="font-display font-bold text-[22px] text-navy-800">
				Corridas
			</h1>

			<TripsList />
		</div>
	);
}
