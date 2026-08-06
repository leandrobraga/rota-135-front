import { createFileRoute } from "@tanstack/react-router";
import { requireRole } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/payouts")({
	beforeLoad: ({ location }) =>
		requireRole(location.href, ["ADMIN", "FINANCE"]),
	component: PayoutsPage,
});

function PayoutsPage() {
	return <h1>Repasses (em construção)</h1>;
}
