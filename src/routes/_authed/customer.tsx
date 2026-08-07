import { createFileRoute } from "@tanstack/react-router";
import { CustomerPage } from "#/features/customer/pages/CustomerPage";
import { requireRole } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/customer")({
	beforeLoad: ({ location }) =>
		requireRole(location.href, ["ADMIN", "OPERATOR"]),
	component: CustomerPage,
});
