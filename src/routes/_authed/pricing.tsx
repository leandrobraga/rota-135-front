import { createFileRoute } from "@tanstack/react-router";
import { requireRole } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/pricing")({
	beforeLoad: ({ location }) =>
		requireRole(location.href, ["ADMIN", "OPERATOR"]),
	component: PricingPage,
});

function PricingPage() {
	return <h1>Precificação (em construção)</h1>;
}
