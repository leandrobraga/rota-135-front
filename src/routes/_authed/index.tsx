import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "#/lib/auth-client";

export const Route = createFileRoute("/_authed/")({
	component: Dashboard,
});

function Dashboard() {
	const { data: session } = useSession();

	return (
		<div>
			<h1 className="font-display text-3xl font-bold text-navy-900">
				Dashboard
			</h1>
			<p className="mt-2 text-neutral-600">Olá, {session?.user.name}.</p>
		</div>
	);
}
