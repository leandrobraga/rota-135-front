import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { MobileMoreSheet } from "#/components/layout/MobileMoreSheet";
import { navItems } from "#/components/layout/nav-config";
import { useSession } from "#/lib/auth-client";

export function MobileTabBar() {
	const [showMore, setShowMore] = useState(false);
	const { data: session } = useSession();
	const role = session?.user.role;

	const visibleItems = navItems.filter(
		(item) => role && item.allowedRoles.includes(role),
	);
	const tabItems = visibleItems.slice(0, 3);

	return (
		<>
			<nav
				className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-neutral-300 border-t bg-white lg:hidden"
				style={{
					paddingBottom: "env(safe-area-inset-bottom)",
				}}
			>
				{tabItems.map((item) => {
					const Icon = item.icon;
					return (
						<Link
							key={item.to}
							to={item.to}
							activeOptions={{ exact: item.to === "/" }}
							className="flex flex-1 flex-col items-center justify-center gap-1 text-[10.5px] font-semibold text-neutral-500"
							activeProps={{
								className: "text-gold-500",
							}}
						>
							<Icon size={20} strokeWidth={2} />
							{item.label}
						</Link>
					);
				})}
				<button
					type="button"
					onClick={() => setShowMore(true)}
					className="flex flex-1 flex-col items-center justify-center gap-1 text-[10.5px] font-semibold text-neutral-500"
				>
					<Menu size={20} strokeWidth={2} />
					Mais
				</button>
			</nav>

			{showMore && (
				<MobileMoreSheet
					items={visibleItems}
					onClose={() => setShowMore(false)}
				/>
			)}
		</>
	);
}
