import { Ban, Pencil } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "#/components/ConfirmDialog";
import { DataTable, type DataTableColumn } from "#/components/DataTable";
import { TripScheduleFormPanel } from "#/features/trip-schedules/components/TripScheduleFormPanel";
import { useCancelTripScheduleMutation } from "#/features/trip-schedules/mutations/use-cancel-trip-schedule-mutation";
import { useTripSchedulesQuery } from "#/features/trip-schedules/queries/use-trip-schedules-query";
import type { TripSchedule } from "#/features/trip-schedules/types";
import { getApiErrorMessage } from "#/lib/api-error";
import { toast } from "#/lib/toast";

const PAGE_SIZE = 20;

const DIRECTION_LABELS: Record<TripSchedule["direction"], string> = {
	MOC_TO_BH: "Montes Claros → BH",
	BH_TO_MOC: "BH → Montes Claros",
};

const STATUS_LABELS: Record<TripSchedule["status"], string> = {
	ACTIVE: "Ativo",
	CANCELLED: "Cancelado",
};

const STATUS_STYLE: Record<TripSchedule["status"], string> = {
	ACTIVE: "bg-sage-100 text-sage-500 px-2.5 py-1",
	CANCELLED: "bg-[#F1E6CC] text-[#9C4A3E] px-2.5 py-1",
};

function TripScheduleStatusBadge({
	status,
}: {
	status: TripSchedule["status"];
}) {
	return (
		<span
			className={`rounded-full font-bold text-[11.5px] ${STATUS_STYLE[status]}`}
		>
			{STATUS_LABELS[status]}
		</span>
	);
}

function formatScheduledAt(scheduledAt: string): string {
	return new Date(scheduledAt).toLocaleString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function TripSchedulesList() {
	const [status, setStatus] = useState<TripSchedule["status"] | "">("");
	const [direction, setDirection] = useState<TripSchedule["direction"] | "">(
		"",
	);
	const [date, setDate] = useState("");
	const [page, setPage] = useState(1);
	const [editingTripSchedule, setEditingTripSchedule] =
		useState<TripSchedule | null>(null);
	const [cancellingTripSchedule, setCancellingTripSchedule] =
		useState<TripSchedule | null>(null);
	const cancelMutation = useCancelTripScheduleMutation(
		cancellingTripSchedule?.id ?? "",
	);

	const { data, isLoading } = useTripSchedulesQuery({
		status: status || undefined,
		direction: direction || undefined,
		date: date || undefined,
		page,
		pageSize: PAGE_SIZE,
	});

	function handleStatusChange(value: TripSchedule["status"] | "") {
		setStatus(value);
		setPage(1);
	}

	function handleDirectionChange(value: TripSchedule["direction"] | "") {
		setDirection(value);
		setPage(1);
	}

	function handleDateChange(value: string) {
		setDate(value);
		setPage(1);
	}

	const tripSchedules = data?.data ?? [];
	const pageCount = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

	const columns: DataTableColumn<TripSchedule>[] = [
		{
			key: "direction",
			label: "Direção",
			mobileRole: "title",
			render: (tripSchedule) => DIRECTION_LABELS[tripSchedule.direction],
		},
		{
			key: "scheduledAt",
			label: "Data/Horário",
			mobileRole: "meta",
			render: (tripSchedule) => formatScheduledAt(tripSchedule.scheduledAt),
		},
		{
			key: "vehicle",
			label: "Veículo",
			mobileRole: "meta",
			render: (tripSchedule) =>
				`${tripSchedule.vehicle.brand} ${tripSchedule.vehicle.model}`,
		},
		{
			key: "driver",
			label: "Motorista",
			mobileRole: "meta",
			render: (tripSchedule) => tripSchedule.driver.name,
		},
		{
			key: "status",
			label: "Status",
			mobileRole: "badge",
			render: (tripSchedule) => (
				<TripScheduleStatusBadge status={tripSchedule.status} />
			),
		},
		{
			key: "id",
			label: "Ações",
			mobileRole: "actions",
			render: (tripSchedule) =>
				tripSchedule.status === "ACTIVE" ? (
					<span className="flex items-center gap-1.5">
						<button
							type="button"
							onClick={(event) => {
								event.stopPropagation();
								setEditingTripSchedule(tripSchedule);
							}}
							aria-label="Editar agendamento"
							className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-navy-800"
						>
							<Pencil size={15} strokeWidth={2} />
						</button>
						<button
							type="button"
							onClick={(event) => {
								event.stopPropagation();
								setCancellingTripSchedule(tripSchedule);
							}}
							aria-label="Cancelar agendamento"
							className="flex h-9 w-9 items-center justify-center rounded-full border border-[#9C4A3E] text-[#9C4A3E]"
						>
							<Ban size={15} strokeWidth={2} />
						</button>
					</span>
				) : null,
		},
	];

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap gap-4">
				<div>
					<label
						htmlFor="trip-schedule-status-filter"
						className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
					>
						STATUS
					</label>
					<select
						id="trip-schedule-status-filter"
						value={status}
						onChange={(event) =>
							handleStatusChange(
								event.target.value as TripSchedule["status"] | "",
							)
						}
						className="h-11 w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500 lg:w-48"
					>
						<option value="">Todos</option>
						<option value="ACTIVE">Ativo</option>
						<option value="CANCELLED">Cancelado</option>
					</select>
				</div>

				<div>
					<label
						htmlFor="trip-schedule-direction-filter"
						className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
					>
						DIREÇÃO
					</label>
					<select
						id="trip-schedule-direction-filter"
						value={direction}
						onChange={(event) =>
							handleDirectionChange(
								event.target.value as TripSchedule["direction"] | "",
							)
						}
						className="h-11 w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500 lg:w-56"
					>
						<option value="">Todas</option>
						<option value="MOC_TO_BH">{DIRECTION_LABELS.MOC_TO_BH}</option>
						<option value="BH_TO_MOC">{DIRECTION_LABELS.BH_TO_MOC}</option>
					</select>
				</div>

				<div>
					<label
						htmlFor="trip-schedule-date-filter"
						className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
					>
						DATA
					</label>
					<input
						id="trip-schedule-date-filter"
						type="date"
						value={date}
						onChange={(event) => handleDateChange(event.target.value)}
						className="h-11 w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500 lg:w-48"
					/>
				</div>
			</div>

			<DataTable
				columns={columns}
				data={tripSchedules}
				isLoading={isLoading}
				emptyMessage="Nenhum agendamento encontrado."
				pagination={{ page, pageCount, onPageChange: setPage }}
				mobilePagination={{
					hasMore: page < pageCount,
					onLoadMore: () => setPage((p) => Math.min(p + 1, pageCount)),
				}}
				resetKey={`${status}-${direction}-${date}`}
			/>

			{editingTripSchedule && (
				<TripScheduleFormPanel
					mode="edit"
					tripSchedule={editingTripSchedule}
					open={Boolean(editingTripSchedule)}
					onOpenChange={(open) => !open && setEditingTripSchedule(null)}
				/>
			)}

			<ConfirmDialog
				open={Boolean(cancellingTripSchedule)}
				onOpenChange={(open) => !open && setCancellingTripSchedule(null)}
				title="Cancelar agendamento"
				description="Isso cancela este horário e TODAS as corridas ativas vinculadas a ele, com reembolso automático dos pagamentos já feitos. Corridas já concluídas não são afetadas. Essa ação não pode ser desfeita."
				confirmLabel="Cancelar agendamento"
				variant="destructive"
				isConfirming={cancelMutation.isPending}
				onConfirm={() => {
					cancelMutation.mutate(undefined, {
						onSuccess: () => setCancellingTripSchedule(null),
						onError: (error) => toast.error(getApiErrorMessage(error)),
					});
				}}
			/>
		</div>
	);
}
