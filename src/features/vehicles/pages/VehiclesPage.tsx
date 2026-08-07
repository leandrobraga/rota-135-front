import { useState } from "react";
import { VehicleFormPanel } from "#/features/vehicles/components/VehicleFormPanel";
import { VehiclesList } from "#/features/vehicles/components/VehiclesList";

export function VehiclesPage() {
	const [creating, setCreating] = useState(false);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h1 className="font-display font-bold text-[22px] text-navy-800">
					Veículos
				</h1>
				<button
					type="button"
					onClick={() => setCreating(true)}
					className="h-11 rounded-[10px] bg-gold-500 px-5 font-bold text-[14px] text-navy-800"
				>
					+ Novo veículo
				</button>
			</div>

			<VehiclesList />

			<VehicleFormPanel
				mode="create"
				open={creating}
				onOpenChange={setCreating}
			/>
		</div>
	);
}
