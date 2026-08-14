import { Link } from "@tanstack/react-router";
import type { Trip } from "#/features/trips/types";

export type AvailabilityView = "day" | "week" | "month";

export type AvailabilityResource = {
	id: string;
	label: string;
};

type Block = {
	trip: Trip;
	start: number;
	end: number;
};

function getViewStart(baseDate: Date, view: AvailabilityView): Date {
	const date = new Date(baseDate);
	date.setHours(0, 0, 0, 0);

	if (view === "day") return date;

	if (view === "week") {
		const day = date.getDay();
		const diffToMonday = day === 0 ? -6 : 1 - day;
		date.setDate(date.getDate() + diffToMonday);
		return date;
	}

	date.setDate(1);
	return date;
}

function getViewEnd(viewStart: Date, view: AvailabilityView): Date {
	const date = new Date(viewStart);

	if (view === "day") {
		date.setDate(date.getDate() + 1);
		return date;
	}

	if (view === "week") {
		date.setDate(date.getDate() + 7);
		return date;
	}

	date.setMonth(date.getMonth() + 1);
	return date;
}

function getAxisLabels(
	viewStart: Date,
	viewEnd: Date,
	view: AvailabilityView,
): { position: number; label: string }[] {
	const totalMs = viewEnd.getTime() - viewStart.getTime();
	const labels: { position: number; label: string }[] = [];

	if (view === "day") {
		for (let hour = 0; hour < 24; hour += 2) {
			const at = new Date(viewStart);
			at.setHours(hour);
			labels.push({
				position: ((at.getTime() - viewStart.getTime()) / totalMs) * 100,
				label: `${String(hour).padStart(2, "0")}h`,
			});
		}
		return labels;
	}

	const cursor = new Date(viewStart);
	while (cursor < viewEnd) {
		labels.push({
			position: ((cursor.getTime() - viewStart.getTime()) / totalMs) * 100,
			label: cursor.toLocaleDateString("pt-BR", {
				day: "2-digit",
				month: view === "month" ? undefined : "2-digit",
			}),
		});
		cursor.setDate(cursor.getDate() + 1);
	}
	return labels;
}

function blocksForResource(
	trips: Trip[],
	resourceId: string,
	windowHours: number,
	viewStart: Date,
	viewEnd: Date,
): Block[] {
	const windowMs = windowHours * 60 * 60 * 1000;
	const viewStartMs = viewStart.getTime();
	const viewEndMs = viewEnd.getTime();

	return trips
		.filter(
			(trip) => trip.driverId === resourceId || trip.vehicleId === resourceId,
		)
		.map((trip) => {
			const scheduledMs = new Date(trip.scheduledAt).getTime();
			return {
				trip,
				start: Math.max(scheduledMs - windowMs, viewStartMs),
				end: Math.min(scheduledMs + windowMs, viewEndMs),
			};
		})
		.filter((block) => block.end > viewStartMs && block.start < viewEndMs);
}

export function AvailabilityGrid({
	resources,
	trips,
	scheduleConflictWindowHours,
	view,
	baseDate,
}: {
	resources: AvailabilityResource[];
	trips: Trip[];
	scheduleConflictWindowHours: number;
	view: AvailabilityView;
	baseDate: Date;
}) {
	const viewStart = getViewStart(baseDate, view);
	const viewEnd = getViewEnd(viewStart, view);
	const totalMs = viewEnd.getTime() - viewStart.getTime();
	const axisLabels = getAxisLabels(viewStart, viewEnd, view);

	if (resources.length === 0) {
		return (
			<p className="py-6 text-center text-[13.5px] text-neutral-600">
				Nenhum recurso disponível.
			</p>
		);
	}

	return (
		<div className="overflow-x-auto">
			<div className="min-w-[640px]">
				<div className="relative ml-[140px] h-6 border-neutral-300 border-b">
					{axisLabels.map((label) => (
						<span
							key={label.label + label.position}
							className="absolute top-0 text-[11px] text-neutral-600"
							style={{ left: `${label.position}%` }}
						>
							{label.label}
						</span>
					))}
				</div>

				<div className="flex flex-col">
					{resources.map((resource) => {
						const blocks = blocksForResource(
							trips,
							resource.id,
							scheduleConflictWindowHours,
							viewStart,
							viewEnd,
						);

						return (
							<div
								key={resource.id}
								className="flex items-center border-neutral-300 border-b py-2"
							>
								<span className="w-[140px] shrink-0 truncate pr-3 text-[13px] text-navy-800">
									{resource.label}
								</span>
								<div className="relative h-8 flex-1 rounded-[6px] bg-cream-100">
									{blocks.map((block) => {
										const left =
											((block.start - viewStart.getTime()) / totalMs) * 100;
										const width = ((block.end - block.start) / totalMs) * 100;

										return (
											<Link
												key={block.trip.id}
												to="/trips/$tripId"
												params={{ tripId: block.trip.id }}
												target="_blank"
												className="absolute top-0 h-full min-w-[3px] rounded-[6px] bg-gold-500 opacity-80 transition-opacity hover:opacity-100"
												style={{
													left: `${left}%`,
													width: `${Math.max(width, 0.5)}%`,
												}}
												title={`${block.trip.client.name} · ${new Date(block.trip.scheduledAt).toLocaleString("pt-BR")}`}
											/>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
