import { useState } from "react";
import { TripScheduleFormPanel } from "#/features/trip-schedules/components/TripScheduleFormPanel";
import { TripSchedulesList } from "#/features/trip-schedules/components/TripSchedulesList";

export function TripSchedulesPage() {
	const [creating, setCreating] = useState(false);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h1 className="font-display font-bold text-[22px] text-navy-800">
					Agendamentos
				</h1>
				<button
					type="button"
					onClick={() => setCreating(true)}
					className="h-11 rounded-[10px] bg-gold-500 px-5 font-bold text-[14px] text-navy-800"
				>
					+ Novo agendamento
				</button>
			</div>

			<TripSchedulesList />

			<TripScheduleFormPanel
				mode="create"
				open={creating}
				onOpenChange={setCreating}
			/>
		</div>
	);
}
