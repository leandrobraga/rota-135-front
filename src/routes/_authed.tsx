import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Shell } from "#/components/layout/Shell";
import { requireSession } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed")({
	beforeLoad: ({ location }) => requireSession(location.href),
	component: AuthedLayout,
});

function AuthedLayout() {
	return (
		<Shell>
			<Outlet />
		</Shell>
	);
}
