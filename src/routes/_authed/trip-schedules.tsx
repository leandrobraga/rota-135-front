import { createFileRoute } from "@tanstack/react-router";
import { TripSchedulesPage } from "#/features/trip-schedules/pages/TripSchedulesPage";
import { requireRole } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/trip-schedules")({
	beforeLoad: ({ location }) =>
		requireRole(location.href, ["ADMIN", "OPERATOR"]),
	component: TripSchedulesPage,
});
