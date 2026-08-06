import { createFileRoute } from "@tanstack/react-router";
import { requireSession } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/notifications")({
	beforeLoad: ({ location }) => requireSession(location.href),
	component: NotificationsPage,
});

function NotificationsPage() {
	return <h1>Notificações (em construção)</h1>;
}
