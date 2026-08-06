import { useRouter } from "@tanstack/react-router";
import { authClient, useSession } from "#/lib/auth-client";

export function Topbar() {
	const router = useRouter();
	const { data: session } = useSession();

	async function handleLogout() {
		await authClient.signOut();
		router.navigate({ to: "/login" });
	}

	return (
		<header className="flex h-16 shrink-0 items-center justify-end gap-4 border-neutral-300 border-b bg-cream-50 px-8">
			<span className="text-sm font-medium text-navy-900">
				{session?.user.name}
			</span>
			<button
				type="button"
				onClick={handleLogout}
				className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:border-navy-900 hover:text-navy-900"
			>
				Sair
			</button>
		</header>
	);
}
