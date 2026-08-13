import { useTripAvailabilityQuery } from "#/features/trips/queries/use-trip-availability-query";

function isValidScheduledAt(scheduledAt: string): boolean {
	return scheduledAt.length > 0 && !Number.isNaN(Date.parse(scheduledAt));
}

export function VehicleAvailabilityList({
	scheduledAt,
	excludeTripId,
	value,
	onChange,
}: {
	scheduledAt: string;
	excludeTripId?: string;
	value: string | null;
	onChange: (vehicleId: string) => void;
}) {
	const valid = isValidScheduledAt(scheduledAt);
	const { data: availability, isLoading } = useTripAvailabilityQuery(
		valid ? scheduledAt : undefined,
		excludeTripId,
	);

	if (!valid) {
		return (
			<p className="py-4 text-center text-[13px] text-neutral-600">
				Escolha data e horário primeiro
			</p>
		);
	}

	if (isLoading) {
		return (
			<p className="py-4 text-center text-[13px] text-neutral-600">
				Carregando disponibilidade...
			</p>
		);
	}

	if (!availability) return null;

	return (
		<ul className="flex flex-col gap-2">
			{availability.vehicles.map((vehicle) => (
				<li key={vehicle.id}>
					<label
						className={`flex items-center justify-between gap-3 rounded-[10px] border-[1.5px] px-4 py-3 ${
							!vehicle.available
								? "cursor-not-allowed border-neutral-300 opacity-60"
								: value === vehicle.id
									? "cursor-pointer border-gold-500"
									: "cursor-pointer border-neutral-300"
						}`}
					>
						<span className="flex items-center gap-2.5">
							<input
								type="radio"
								name="vehicle-availability"
								value={vehicle.id}
								disabled={!vehicle.available}
								checked={value === vehicle.id}
								onChange={() => onChange(vehicle.id)}
								className="accent-gold-500"
							/>
							<span className="text-[14.5px] text-navy-800">
								{vehicle.plate} · {vehicle.brand} {vehicle.model}
							</span>
						</span>
						<span
							className={`rounded-full px-2.5 py-1 font-bold text-[11.5px] ${
								vehicle.available
									? "bg-sage-100 text-sage-500"
									: "bg-neutral-300 text-neutral-600"
							}`}
						>
							{vehicle.available ? "Disponível" : "Ocupado"}
						</span>
					</label>
				</li>
			))}
		</ul>
	);
}
