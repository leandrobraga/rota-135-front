import { createFileRoute } from "@tanstack/react-router";
import { requireRole } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/vehicles")({
	beforeLoad: ({ location }) =>
		requireRole(location.href, ["ADMIN", "OPERATOR"]),
	component: VehiclesPage,
});

function VehiclesPage() {
	return <h1>Veículos (em construção)</h1>;
}
