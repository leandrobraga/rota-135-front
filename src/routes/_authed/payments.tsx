import { createFileRoute } from "@tanstack/react-router";
import { PaymentsPage } from "#/features/payments/pages/PaymentsPage";
import { requireRole } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/payments")({
	beforeLoad: ({ location }) =>
		requireRole(location.href, ["ADMIN", "FINANCE"]),
	component: PaymentsPage,
});
