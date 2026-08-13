import { createFileRoute } from "@tanstack/react-router";
import { TripDetailPage } from "#/features/trips/pages/TripDetailPage";
import { requireRole } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/trips/$tripId")({
	beforeLoad: ({ location }) =>
		requireRole(location.href, ["ADMIN", "OPERATOR"]),
	component: TripDetailRoute,
});

function TripDetailRoute() {
	const { tripId } = Route.useParams();
	return <TripDetailPage tripId={tripId} />;
}
