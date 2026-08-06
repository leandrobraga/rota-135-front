import { useLocation, useRouter } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { navItems } from "#/components/layout/nav-config";

export function Topbar() {
	const router = useRouter();
	const { pathname } = useLocation();

	const activeItem =
		navItems.find((item) =>
			item.to === "/" ? pathname === "/" : pathname.startsWith(item.to),
		) ?? navItems[0];

	function handleNotificationsClick() {
		router.navigate({ to: "/notifications" });
	}

	return (
		<header className="flex h-[76px] shrink-0 items-center justify-between border-neutral-300 border-b bg-white px-8">
			<div className="font-display font-bold text-[22px] text-navy-800">
				{activeItem?.label}
			</div>
			<button
				type="button"
				onClick={handleNotificationsClick}
				aria-label="Notificações"
				className="text-navy-800"
			>
				<Bell size={22} strokeWidth={2} />
			</button>
		</header>
	);
}
