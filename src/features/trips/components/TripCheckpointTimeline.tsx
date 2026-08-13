import { Check } from "lucide-react";
import type { Trip } from "#/features/trips/types";

const STEPS: {
	key: keyof NonNullable<Trip["checkpoint"]>;
	label: string;
}[] = [
	{ key: "driverArrivedPickupAt", label: "Motorista chegou ao embarque" },
	{ key: "clientConfirmedPickupAt", label: "Cliente confirmou embarque" },
	{ key: "driverArrivedDropoffAt", label: "Motorista chegou ao desembarque" },
	{ key: "clientConfirmedDropoffAt", label: "Cliente confirmou desembarque" },
];

function formatCheckpointDate(value: string): string {
	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(new Date(value));
}

export function TripCheckpointTimeline({
	checkpoint,
}: {
	checkpoint: Trip["checkpoint"];
}) {
	return (
		<ul className="flex flex-col">
			{STEPS.map((step, index) => {
				const value = checkpoint?.[step.key] as string | null | undefined;
				const done = Boolean(value);
				const isLast = index === STEPS.length - 1;

				return (
					<li key={step.key} className="flex gap-3">
						<div className="flex flex-col items-center">
							<span
								className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
									done
										? "bg-sage-500 text-white"
										: "bg-neutral-300 text-neutral-500"
								}`}
							>
								{done && <Check size={14} strokeWidth={3} />}
							</span>
							{!isLast && (
								<span
									className={`w-[2px] flex-1 ${done ? "bg-sage-500" : "bg-neutral-300"}`}
								/>
							)}
						</div>
						<div className={isLast ? "pb-0" : "pb-4"}>
							<p
								className={`text-[13.5px] font-medium ${
									done ? "text-navy-800" : "text-neutral-500"
								}`}
							>
								{step.label}
							</p>
							<p className="text-[12px] text-neutral-600">
								{value ? formatCheckpointDate(value) : "Pendente"}
							</p>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
