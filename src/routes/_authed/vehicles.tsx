import { createFileRoute } from "@tanstack/react-router";
import { VehiclesPage } from "#/features/vehicles/pages/VehiclesPage";
import { requireRole } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/vehicles")({
	beforeLoad: ({ location }) =>
		requireRole(location.href, ["ADMIN", "OPERATOR"]),
	component: VehiclesPage,
});
