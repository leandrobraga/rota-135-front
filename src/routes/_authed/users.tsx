import { createFileRoute } from "@tanstack/react-router";
import { UsersPage } from "#/features/users/pages/UsersPage";
import { requireRole } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/users")({
	beforeLoad: ({ location }) => requireRole(location.href, ["ADMIN"]),
	component: UsersPage,
});
