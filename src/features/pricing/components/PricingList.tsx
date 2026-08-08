import { useState } from "react";
import { DataTable, type DataTableColumn } from "#/components/DataTable";
import { PricingFormPanel } from "#/features/pricing/components/PricingFormPanel";
import { usePricingQuery } from "#/features/pricing/queries/usePricingQuery";
import type { Pricing } from "#/features/pricing/types";
import { formatCurrencyDisplay } from "#/lib/formatters";

const OCCUPANCY_TYPE_LABELS: Record<Pricing["occupancyType"], string> = {
	SEAT: "Por assento",
	FULL_CAR: "Carro inteiro",
};

export function PricingList() {
	const [editingPricing, setEditingPricing] = useState<Pricing | null>(null);

	const { data, isLoading } = usePricingQuery();
	const pricing = data ?? [];

	const columns: DataTableColumn<Pricing>[] = [
		{
			key: "occupancyType",
			label: "Tipo",
			mobileRole: "title",
			render: (item) => OCCUPANCY_TYPE_LABELS[item.occupancyType],
		},
		{
			key: "price",
			label: "Preço",
			mobileRole: "meta",
			render: (item) => formatCurrencyDisplay(item.price),
		},
	];

	return (
		<>
			<DataTable
				columns={columns}
				data={pricing}
				isLoading={isLoading}
				emptyMessage="Nenhuma tarifa encontrada."
				onRowClick={(item) => setEditingPricing(item)}
			/>

			{editingPricing && (
				<PricingFormPanel
					pricing={editingPricing}
					open={Boolean(editingPricing)}
					onOpenChange={(open) => !open && setEditingPricing(null)}
				/>
			)}
		</>
	);
}
