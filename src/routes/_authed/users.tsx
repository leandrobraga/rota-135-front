import { createFileRoute } from "@tanstack/react-router";
import { requireRole } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/users")({
	beforeLoad: ({ location }) => requireRole(location.href, ["ADMIN"]),
	component: UsersPage,
});

function UsersPage() {
	return <h1>Usuários (em construção)</h1>;
}
