import { createFileRoute } from "@tanstack/react-router";
import { requireRole } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/customer")({
	beforeLoad: ({ location }) =>
		requireRole(location.href, ["ADMIN", "OPERATOR"]),
	component: CustomerPage,
});

function CustomerPage() {
	return <h1>Clientes (em construção)</h1>;
}
