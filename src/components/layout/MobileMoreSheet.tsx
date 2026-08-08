import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useState } from "react";
import { NavList } from "#/components/layout/NavList";
import type { NavItem } from "#/components/layout/nav-config";
import { UserProfile } from "#/components/layout/UserProfile";
import { ChangePasswordPanel } from "#/features/auth/components/ChangePasswordPanel";
import { authClient, useSession } from "#/lib/auth-client";

export function MobileMoreSheet({
	items,
	onClose,
}: {
	items: NavItem[];
	onClose: () => void;
}) {
	const router = useRouter();
	const { data: session } = useSession();
	const [changingPassword, setChangingPassword] = useState(false);

	async function handleLogout() {
		await authClient.signOut();
		router.navigate({ to: "/login" });
	}

	return (
		<div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
			<button
				type="button"
				aria-label="Fechar menu"
				onClick={onClose}
				className="absolute inset-0 bg-navy-900/50"
			/>
			<div className="relative flex max-h-[85vh] flex-col rounded-t-2xl bg-navy-900">
				<div className="flex items-center justify-between border-navy-600 border-b px-5 py-4">
					<UserProfile name={session?.user.name} role={session?.user.role} />
					<button
						type="button"
						aria-label="Fechar"
						onClick={onClose}
						className="shrink-0 text-navy-300"
					>
						<X size={22} strokeWidth={2} />
					</button>
				</div>

				<nav className="flex flex-col gap-0.5 overflow-y-auto px-3 py-2">
					<NavList items={items} onNavigate={onClose} />
				</nav>

				<div
					className="flex flex-col gap-2.5 p-4"
					style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
				>
					<button
						type="button"
						onClick={() => setChangingPassword(true)}
						className="h-11 w-full rounded-[9px] border border-navy-600 text-[13px] font-semibold text-navy-300"
					>
						Trocar senha
					</button>
					<button
						type="button"
						onClick={handleLogout}
						className="h-11 w-full rounded-[9px] border border-navy-600 text-[13px] font-semibold text-navy-300"
					>
						Sair
					</button>
				</div>
			</div>

			<ChangePasswordPanel
				open={changingPassword}
				onOpenChange={setChangingPassword}
			/>
		</div>
	);
}
