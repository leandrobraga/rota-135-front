import { useRouter } from "@tanstack/react-router";
import { NavList } from "#/components/layout/NavList";
import { navItems } from "#/components/layout/nav-config";
import { UserProfile } from "#/components/layout/UserProfile";
import { authClient, useSession } from "#/lib/auth-client";

export function Sidebar() {
	const router = useRouter();
	const { data: session } = useSession();
	const role = session?.user.role;

	const visibleItems = navItems.filter(
		(item) => role && item.allowedRoles.includes(role),
	);

	async function handleLogout() {
		await authClient.signOut();
		router.navigate({ to: "/login" });
	}

	return (
		<aside className="hidden min-h-screen w-60 shrink-0 flex-col bg-navy-900 lg:flex">
			<div className="px-6 pt-6.5 pb-5">
				<div className="font-display text-[21px] font-bold tracking-wide text-white">
					ROTA 135
				</div>
				<div className="mt-1 text-[11px] font-semibold tracking-[2px] text-gold-500">
					PAINEL ADMIN
				</div>
			</div>

			<nav className="flex flex-1 flex-col gap-0.5 px-3 py-2">
				<NavList items={visibleItems} />
			</nav>

			<div className="flex flex-col gap-2.5 border-navy-600 border-t p-4">
				<UserProfile name={session?.user.name} role={role} />
				<button
					type="button"
					onClick={handleLogout}
					className="h-9 w-full rounded-[9px] border border-navy-600 text-[12.5px] font-semibold text-navy-300"
				>
					Sair
				</button>
			</div>
		</aside>
	);
}
