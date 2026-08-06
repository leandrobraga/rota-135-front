import { createFileRoute } from "@tanstack/react-router";
import { requireRole } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/payments")({
	beforeLoad: ({ location }) =>
		requireRole(location.href, ["ADMIN", "FINANCE"]),
	component: PaymentsPage,
});

function PaymentsPage() {
	return <h1>Pagamentos (em construção)</h1>;
}
