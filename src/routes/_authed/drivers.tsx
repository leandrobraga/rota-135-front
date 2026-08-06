import { createFileRoute } from "@tanstack/react-router";
import { requireRole } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/drivers")({
	beforeLoad: ({ location }) =>
		requireRole(location.href, ["ADMIN", "OPERATOR"]),
	component: DriversPage,
});

function DriversPage() {
	return <h1>Motoristas (em construção)</h1>;
}
