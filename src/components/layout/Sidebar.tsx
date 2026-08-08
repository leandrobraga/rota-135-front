import { useRouter } from "@tanstack/react-router";
import { ChevronsUpDown, KeyRound, LogOut } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { useState } from "react";
import { NavList } from "#/components/layout/NavList";
import { navItems } from "#/components/layout/nav-config";
import { UserProfile } from "#/components/layout/UserProfile";
import { ChangePasswordPanel } from "#/features/auth/components/ChangePasswordPanel";
import { authClient, useSession } from "#/lib/auth-client";

export function Sidebar() {
	const router = useRouter();
	const { data: session } = useSession();
	const role = session?.user.role;
	const [changingPassword, setChangingPassword] = useState(false);

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

			<div className="border-navy-600 border-t p-4">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild>
						<button
							type="button"
							className="flex w-full cursor-pointer items-center gap-2.5 rounded-[9px] p-1.5 outline-none hover:bg-white/5"
						>
							<UserProfile name={session?.user.name} role={role} />
							<ChevronsUpDown
								size={16}
								strokeWidth={2}
								className="ml-auto shrink-0 text-navy-300"
							/>
						</button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Portal>
						<DropdownMenu.Content
							side="right"
							align="end"
							sideOffset={8}
							className="z-50 min-w-48 rounded-xl border border-neutral-300 bg-white p-1.5 shadow-lg"
						>
							<DropdownMenu.Item
								onSelect={() => setChangingPassword(true)}
								className="flex h-11 cursor-pointer items-center gap-2.5 rounded-lg px-3 text-[14px] font-medium text-navy-800 outline-none data-[highlighted]:bg-cream-50"
							>
								<KeyRound size={16} strokeWidth={2} />
								Trocar senha
							</DropdownMenu.Item>
							<DropdownMenu.Separator className="my-1.5 border-neutral-300 border-t" />
							<DropdownMenu.Item
								onSelect={handleLogout}
								className="flex h-11 cursor-pointer items-center gap-2.5 rounded-lg px-3 text-[14px] font-medium text-navy-800 outline-none data-[highlighted]:bg-cream-50"
							>
								<LogOut size={16} strokeWidth={2} />
								Sair
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				</DropdownMenu.Root>
			</div>

			<ChangePasswordPanel
				open={changingPassword}
				onOpenChange={setChangingPassword}
			/>
		</aside>
	);
}
