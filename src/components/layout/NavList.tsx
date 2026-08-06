import { Link } from "@tanstack/react-router";
import type { NavItem } from "#/components/layout/nav-config";

export function NavList({
	items,
	onNavigate,
}: {
	items: NavItem[];
	onNavigate?: () => void;
}) {
	return (
		<>
			{items.map((item) => {
				const Icon = item.icon;
				return (
					<Link
						key={item.to}
						to={item.to}
						activeOptions={{ exact: item.to === "/" }}
						onClick={onNavigate}
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
		</>
	);
}
