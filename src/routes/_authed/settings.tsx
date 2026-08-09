import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "#/features/trip-settings/pages/SettingsPage";
import { requireRole } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/settings")({
	beforeLoad: ({ location }) => requireRole(location.href, ["ADMIN"]),
	component: SettingsPage,
});
