import { PricingList } from "#/features/pricing/components/PricingList";

export function PricingPage() {
	return (
		<div className="flex flex-col gap-6">
			<h1 className="font-display font-bold text-[22px] text-navy-800">
				Precificação
			</h1>

			<PricingList />
		</div>
	);
}
