import type { ReactNode } from "react";
import { MobileTabBar } from "#/components/layout/MobileTabBar";
import { Sidebar } from "#/components/layout/Sidebar";
import { Topbar } from "#/components/layout/Topbar";

export function Shell({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen">
			<Sidebar />
			<div className="flex min-w-0 flex-1 flex-col">
				<Topbar />
				<main className="min-h-0 flex-1 overflow-y-auto p-8 pb-24 lg:pb-8">
					{children}
				</main>
			</div>
			<MobileTabBar />
		</div>
	);
}
