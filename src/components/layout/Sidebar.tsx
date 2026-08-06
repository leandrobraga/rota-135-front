import { Link, useRouter } from "@tanstack/react-router";
import { navItems } from "#/components/layout/nav-config";
import type { Role } from "#/lib/auth-client";
import { authClient, useSession } from "#/lib/auth-client";

const ROLE_LABELS: Record<Role, string> = {
	ADMIN: "Administrador",
	OPERATOR: "Operador",
	FINANCE: "Financeiro",
	DRIVER: "Motorista",
	CUSTOMER: "Cliente",
};

function getInitials(name: string) {
	const parts = name.trim().split(/\s+/);
	const first = parts[0]?.[0] ?? "";
	const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
	return (first + last).toUpperCase();
}

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
		<aside className="flex min-h-screen w-60 shrink-0 flex-col bg-navy-900">
			<div className="px-6 pt-6.5 pb-5">
				<div className="font-display text-[21px] font-bold tracking-wide text-white">
					ROTA 135
				</div>
				<div className="mt-1 text-[11px] font-semibold tracking-[2px] text-gold-500">
					PAINEL ADMIN
				</div>
			</div>

			<nav className="flex flex-1 flex-col gap-0.5 px-3 py-2">
				{visibleItems.map((item) => {
					const Icon = item.icon;
					return (
						<Link
							key={item.to}
							to={item.to}
							activeOptions={{ exact: item.to === "/" }}
							className="flex h-11 items-center gap-3 rounded-[10px] px-3.5 text-[13.5px] font-semibold text-navy-300"
							activeProps={{
								className: "bg-navy-700 text-gold-500",
							}}
						>
							<Icon size={17} strokeWidth={2} />
							{item.label}
						</Link>
					);
				})}
			</nav>

			<div className="flex flex-col gap-2.5 border-navy-600 border-t p-4">
				<div className="flex items-center gap-2.5">
					<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-gold-500 bg-navy-700 font-semibold text-[13px] text-gold-500">
						{session ? getInitials(session.user.name) : ""}
					</div>
					<div className="min-w-0">
						<div className="truncate font-semibold text-[13.5px] text-white">
							{session?.user.name}
						</div>
						<div className="text-[11.5px] text-navy-300">
							{session?.user.role ? ROLE_LABELS[session.user.role] : ""}
						</div>
					</div>
				</div>
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
