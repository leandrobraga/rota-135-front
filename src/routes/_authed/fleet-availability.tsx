import { createFileRoute } from "@tanstack/react-router";
import { FleetAvailabilityPage } from "#/features/trips/pages/FleetAvailabilityPage";
import { requireRole } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/fleet-availability")({
	beforeLoad: ({ location }) =>
		requireRole(location.href, ["ADMIN", "OPERATOR"]),
	component: FleetAvailabilityPage,
});
