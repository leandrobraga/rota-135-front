import { Link } from "@tanstack/react-router";
import { navItems } from "#/components/layout/nav-config";
import { useSession } from "#/lib/auth-client";

export function Sidebar() {
	const { data: session } = useSession();
	const role = session?.user.role;

	const visibleItems = navItems.filter(
		(item) => role && item.allowedRoles.includes(role),
	);

	return (
		<aside className="flex w-64 shrink-0 flex-col bg-navy-900 text-cream-100">
			<div className="px-6 py-8">
				<span className="font-display text-2xl font-bold text-gold-500">
					Rota 135
				</span>
			</div>
			<nav className="flex flex-col gap-1 px-3">
				{visibleItems.map((item) => (
					<Link
						key={item.to}
						to={item.to}
						activeOptions={{ exact: item.to === "/" }}
						className="rounded-xl px-4 py-2.5 text-sm font-medium text-cream-100/80 transition-colors hover:bg-navy-800 hover:text-cream-100"
						activeProps={{
							className: "bg-navy-800 text-gold-500",
						}}
					>
						{item.label}
					</Link>
				))}
			</nav>
		</aside>
	);
}
