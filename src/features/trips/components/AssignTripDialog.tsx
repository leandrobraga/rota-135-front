import { useState } from "react";
import { FormPanel } from "#/components/FormPanel";
import { VehicleAvailabilityList } from "#/features/trips/components/VehicleAvailabilityList";
import { useAssignTripMutation } from "#/features/trips/mutations/use-assign-trip-mutation";
import { useTripAvailabilityQuery } from "#/features/trips/queries/use-trip-availability-query";
import type { Trip } from "#/features/trips/types";
import { getApiFieldError } from "#/lib/api-error";

export function AssignTripDialog({
	trip,
	open,
	onOpenChange,
}: {
	trip: Trip;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { data: availability, isLoading } = useTripAvailabilityQuery(
		trip.scheduledAt,
		trip.id,
	);
	const assignMutation = useAssignTripMutation(trip.id);

	const [driverId, setDriverId] = useState<string | null>(null);
	const [vehicleId, setVehicleId] = useState<string | null>(
		trip.vehicle?.id ?? null,
	);
	const [error, setError] = useState<string | null>(null);

	function resetAndClose() {
		setDriverId(null);
		setVehicleId(trip.vehicle?.id ?? null);
		setError(null);
		onOpenChange(false);
	}

	function handleSubmit() {
		if (!driverId || !vehicleId) return;
		setError(null);

		assignMutation.mutate(
			{ driverId, vehicleId },
			{
				onSuccess: () => resetAndClose(),
				onError: (err) => setError(getApiFieldError(err).message),
			},
		);
	}

	return (
		<FormPanel
			open={open}
			onOpenChange={(next) => !next && resetAndClose()}
			title="Atribuir motorista e veículo"
			footer={
				<>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={assignMutation.isPending || !driverId || !vehicleId}
						className={`h-[46px] rounded-[10px] font-bold text-[14.5px] transition-colors disabled:cursor-not-allowed ${
							assignMutation.isPending || !driverId || !vehicleId
								? "bg-[#E8E3D8] text-[#A9A196]"
								: "bg-gold-500 text-navy-800"
						}`}
					>
						{assignMutation.isPending ? "Aguarde..." : "Atribuir"}
					</button>
					<button
						type="button"
						onClick={resetAndClose}
						className="h-[46px] rounded-[10px] border border-neutral-300 bg-white font-bold text-[14.5px] text-navy-800"
					>
						Cancelar
					</button>
				</>
			}
		>
			<div className="flex flex-col gap-5">
				{isLoading && (
					<p className="py-8 text-center text-[13.5px] text-neutral-600">
						Carregando disponibilidade...
					</p>
				)}

				{availability && (
					<>
						<div>
							<span className="mb-2 block text-[12px] font-bold tracking-[0.3px] text-neutral-600">
								MOTORISTA
							</span>
							<ul className="flex flex-col gap-2">
								{availability.drivers.map((driver) => (
									<li key={driver.id}>
										<label
											className={`flex items-center justify-between gap-3 rounded-[10px] border-[1.5px] px-4 py-3 ${
												!driver.available
													? "cursor-not-allowed border-neutral-300 opacity-60"
													: driverId === driver.id
														? "cursor-pointer border-gold-500"
														: "cursor-pointer border-neutral-300"
											}`}
										>
											<span className="flex items-center gap-2.5">
												<input
													type="radio"
													name="assign-driver"
													value={driver.id}
													disabled={!driver.available}
													checked={driverId === driver.id}
													onChange={() => setDriverId(driver.id)}
													className="accent-gold-500"
												/>
												<span className="text-[14.5px] text-navy-800">
													{driver.name}
												</span>
											</span>
											<span
												className={`rounded-full px-2.5 py-1 font-bold text-[11.5px] ${
													driver.available
														? "bg-sage-100 text-sage-500"
														: "bg-neutral-300 text-neutral-600"
												}`}
											>
												{driver.available ? "Disponível" : "Ocupado"}
											</span>
										</label>
									</li>
								))}
							</ul>
						</div>

						<div>
							<span className="mb-2 block text-[12px] font-bold tracking-[0.3px] text-neutral-600">
								VEÍCULO
							</span>
							<VehicleAvailabilityList
								scheduledAt={trip.scheduledAt}
								excludeTripId={trip.id}
								value={vehicleId}
								onChange={setVehicleId}
							/>
						</div>
					</>
				)}

				{error && (
					<div className="rounded-[10px] bg-[#F1E6CC] px-3.5 py-2.5 text-center text-[13px] font-medium text-[#9C4A3E]">
						{error}
					</div>
				)}
			</div>
		</FormPanel>
	);
}
