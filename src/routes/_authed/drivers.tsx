import { createFileRoute } from "@tanstack/react-router";
import { DriversPage } from "#/features/drivers/pages/DriversPage";
import { requireRole } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/drivers")({
	beforeLoad: ({ location }) =>
		requireRole(location.href, ["ADMIN", "OPERATOR"]),
	component: DriversPage,
});
