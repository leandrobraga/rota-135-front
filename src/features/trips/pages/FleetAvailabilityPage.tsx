import { useState } from "react";
import { useDriversQuery } from "#/features/drivers/queries/use-drivers-query";
import { useTripSettingsQuery } from "#/features/trip-settings/queries/use-trip-settings-query";
import {
	AvailabilityGrid,
	type AvailabilityView,
} from "#/features/trips/components/AvailabilityGrid";
import { useTripsByDateRangeQuery } from "#/features/trips/queries/use-trips-by-range-query";
import type { Trip } from "#/features/trips/types";
import { useVehiclesQuery } from "#/features/vehicles/queries/use-vehicles-query";

const VIEW_OPTIONS: { value: AvailabilityView; label: string }[] = [
	{ value: "day", label: "Dia" },
	{ value: "week", label: "Semana" },
	{ value: "month", label: "Mês" },
];

function getRangeBounds(
	baseDate: Date,
	view: AvailabilityView,
): { from: string; to: string } {
	const start = new Date(baseDate);
	start.setHours(0, 0, 0, 0);

	if (view === "week") {
		const day = start.getDay();
		const diffToMonday = day === 0 ? -6 : 1 - day;
		start.setDate(start.getDate() + diffToMonday);
	} else if (view === "month") {
		start.setDate(1);
	}

	const end = new Date(start);
	if (view === "day") end.setDate(end.getDate() + 1);
	else if (view === "week") end.setDate(end.getDate() + 7);
	else end.setMonth(end.getMonth() + 1);

	return { from: start.toISOString(), to: end.toISOString() };
}

function toDateInputValue(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function FleetAvailabilityPage() {
	const [view, setView] = useState<AvailabilityView>("week");
	const [baseDate, setBaseDate] = useState(new Date());

	const { data: tripSettings } = useTripSettingsQuery();
	const { data: driversData } = useDriversQuery({ pageSize: 500 });
	const { data: vehiclesData } = useVehiclesQuery({ pageSize: 500 });

	const { from, to } = getRangeBounds(baseDate, view);
	const { data: tripsData, isLoading: isLoadingTrips } =
		useTripsByDateRangeQuery({ from, to });

	const driverResources = (driversData?.data ?? [])
		.filter((driver) => driver.active && driver.approvalStatus === "APPROVED")
		.map((driver) => ({ id: driver.id, label: driver.name }));

	const vehicleResources = (vehiclesData?.data ?? [])
		.filter((vehicle) => vehicle.active)
		.map((vehicle) => ({ id: vehicle.id, label: vehicle.plate }));

	const trips = (tripsData?.data ?? []) as Trip[];

	return (
		<div className="flex flex-col gap-6">
			<h1 className="font-display font-bold text-[22px] text-navy-800">
				Disponibilidade da frota
			</h1>

			<div className="flex flex-wrap items-end gap-3">
				<div>
					<span className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600">
						VISÃO
					</span>
					<div className="flex gap-2">
						{VIEW_OPTIONS.map((option) => (
							<button
								key={option.value}
								type="button"
								onClick={() => setView(option.value)}
								className={`h-10 rounded-[10px] px-4 font-bold text-[13.5px] transition-colors ${
									view === option.value
										? "bg-gold-500 text-navy-800"
										: "border border-neutral-300 bg-white text-navy-800"
								}`}
							>
								{option.label}
							</button>
						))}
					</div>
				</div>

				<div>
					<label
						htmlFor="fleet-base-date"
						className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
					>
						DATA
					</label>
					<input
						id="fleet-base-date"
						type="date"
						value={toDateInputValue(baseDate)}
						onChange={(event) => {
							if (!event.target.value) return;
							setBaseDate(new Date(`${event.target.value}T00:00:00`));
						}}
						className="h-10 rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14px] text-navy-800 outline-none focus:border-gold-500"
					/>
				</div>
			</div>

			{isLoadingTrips || !tripSettings ? (
				<p className="py-8 text-center text-[13.5px] text-neutral-600">
					Carregando...
				</p>
			) : (
				<>
					<div>
						<h2 className="mb-3 font-display font-bold text-[17px] text-navy-800">
							Motoristas
						</h2>
						<AvailabilityGrid
							resources={driverResources}
							trips={trips}
							scheduleConflictWindowHours={
								tripSettings.scheduleConflictWindowHours
							}
							view={view}
							baseDate={baseDate}
						/>
					</div>

					<div>
						<h2 className="mb-3 font-display font-bold text-[17px] text-navy-800">
							Veículos
						</h2>
						<AvailabilityGrid
							resources={vehicleResources}
							trips={trips}
							scheduleConflictWindowHours={
								tripSettings.scheduleConflictWindowHours
							}
							view={view}
							baseDate={baseDate}
						/>
					</div>
				</>
			)}
		</div>
	);
}
