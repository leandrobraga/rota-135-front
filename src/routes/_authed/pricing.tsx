import { createFileRoute } from "@tanstack/react-router";
import { PricingPage } from "#/features/pricing/pages/PricingPage";
import { requireRole } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/pricing")({
	beforeLoad: ({ location }) =>
		requireRole(location.href, ["ADMIN", "OPERATOR"]),
	component: PricingPage,
});
