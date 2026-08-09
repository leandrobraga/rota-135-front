import { Tabs } from "radix-ui";
import type { ReactNode } from "react";

export type SettingsTab = {
	value: string;
	label: string;
	content: ReactNode;
};

export function SettingsTabs({ tabs }: { tabs: SettingsTab[] }) {
	return (
		<Tabs.Root defaultValue={tabs[0]?.value}>
			<Tabs.List className="flex gap-1 border-neutral-300 border-b">
				{tabs.map((tab) => (
					<Tabs.Trigger
						key={tab.value}
						value={tab.value}
						className="cursor-pointer border-transparent border-b-2 px-4 py-2.5 font-semibold text-[13.5px] text-neutral-600 outline-none data-[state=active]:border-gold-500 data-[state=active]:text-navy-800"
					>
						{tab.label}
					</Tabs.Trigger>
				))}
			</Tabs.List>
			{tabs.map((tab) => (
				<Tabs.Content key={tab.value} value={tab.value} className="pt-6">
					{tab.content}
				</Tabs.Content>
			))}
		</Tabs.Root>
	);
}
