import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DataTable, type DataTableColumn } from "#/components/DataTable";
import { PaymentStatusBadge } from "#/features/trips/components/PaymentStatusBadge";
import { TripBookingTypeBadge } from "#/features/trips/components/TripBookingTypeBadge";
import { TripStatusBadge } from "#/features/trips/components/TripStatusBadge";
import { useTripsQuery } from "#/features/trips/queries/use-trips-query";
import type { Trip, TripStatus } from "#/features/trips/types";
import { formatCurrencyDisplay } from "#/lib/formatters";

const PAGE_SIZE = 20;

const STATUS_FILTER_OPTIONS: { value: TripStatus | ""; label: string }[] = [
	{ value: "", label: "Todos" },
	{ value: "AWAITING_PAYMENT", label: "Aguardando pagamento" },
	{ value: "SCHEDULED", label: "Agendada" },
	{ value: "AWAITING_BOARDING", label: "Aguardando embarque" },
	{ value: "IN_PROGRESS", label: "Em andamento" },
	{ value: "AWAITING_DROPOFF", label: "Aguardando desembarque" },
	{ value: "COMPLETED", label: "Concluída" },
	{ value: "CANCELLED", label: "Cancelada" },
];

function formatScheduledAt(scheduledAt: string): string {
	return new Date(scheduledAt).toLocaleString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function truncate(text: string, max: number): string {
	return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function TripsList() {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<TripStatus | "">("");
	const [page, setPage] = useState(1);

	const { data, isLoading } = useTripsQuery({
		search: search || undefined,
		status: status || undefined,
		page,
		pageSize: PAGE_SIZE,
	});

	function handleSearchChange(value: string) {
		setSearch(value);
		setPage(1);
	}

	function handleStatusChange(value: TripStatus | "") {
		setStatus(value);
		setPage(1);
	}

	const trips = (data?.data ?? []) as Trip[];
	const pageCount = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

	const columns: DataTableColumn<Trip>[] = [
		{
			key: "clientId",
			label: "Cliente",
			mobileRole: "title",
			render: (trip) => trip.client.name,
		},
		{
			key: "status",
			label: "Status",
			mobileRole: "badge",
			render: (trip) => (
				<span className="flex flex-wrap items-center gap-1.5">
					<TripStatusBadge status={trip.status} />
					<TripBookingTypeBadge bookingType={trip.bookingType} />
					<PaymentStatusBadge payment={trip.payment} />
				</span>
			),
		},
		{
			key: "scheduledAt",
			label: "Agendamento",
			mobileRole: "meta",
			render: (trip) =>
				`${formatScheduledAt(trip.scheduledAt)} · ${truncate(trip.pickupAddress, 20)} → ${truncate(trip.dropoffAddress, 20)} · ${formatCurrencyDisplay(trip.price)}`,
		},
	];

	return (
		<>
			<div className="mb-4">
				<label
					htmlFor="trip-status-filter"
					className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
				>
					STATUS
				</label>
				<select
					id="trip-status-filter"
					value={status}
					onChange={(event) =>
						handleStatusChange(event.target.value as TripStatus | "")
					}
					className="h-11 w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500 lg:max-w-xs"
				>
					{STATUS_FILTER_OPTIONS.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>

			<DataTable
				columns={columns}
				data={trips}
				isLoading={isLoading}
				emptyMessage="Nenhuma corrida encontrada."
				onRowClick={(trip) =>
					navigate({ to: "/trips/$tripId", params: { tripId: trip.id } })
				}
				search={{
					value: search,
					onChange: handleSearchChange,
					placeholder: "Buscar por cliente, CPF ou endereço...",
				}}
				pagination={{ page, pageCount, onPageChange: setPage }}
				mobilePagination={{
					hasMore: page < pageCount,
					onLoadMore: () => setPage((p) => Math.min(p + 1, pageCount)),
				}}
				resetKey={`${search}-${status}`}
			/>
		</>
	);
}
