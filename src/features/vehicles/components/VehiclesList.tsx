import { useState } from "react";
import { ActiveStatusBadge } from "#/components/ActiveStatusBadge";
import { DataTable, type DataTableColumn } from "#/components/DataTable";
import { VehicleFormPanel } from "#/features/vehicles/components/VehicleFormPanel";
import { useVehiclesQuery } from "#/features/vehicles/queries/use-vehicles-query";
import type { Vehicle } from "#/features/vehicles/types";

const PAGE_SIZE = 20;

export function VehiclesList() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

	const { data, isLoading } = useVehiclesQuery({
		search: search || undefined,
		page,
		pageSize: PAGE_SIZE,
	});

	function handleSearchChange(value: string) {
		setSearch(value);
		setPage(1);
	}

	const vehicles = (data?.data ?? []) as Vehicle[];
	const pageCount = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

	const columns: DataTableColumn<Vehicle>[] = [
		{ key: "plate", label: "Placa", mobileRole: "title" },
		{
			key: "brand",
			label: "Marca/Modelo",
			mobileRole: "meta",
			render: (vehicle) => `${vehicle.brand} ${vehicle.model}`,
		},
		{
			key: "capacity",
			label: "Capacidade",
			mobileRole: "meta",
			render: (vehicle) => `${vehicle.capacity} lugares`,
		},
		{
			key: "active",
			label: "Status",
			mobileRole: "badge",
			render: (vehicle) => <ActiveStatusBadge active={vehicle.active} />,
		},
	];

	return (
		<>
			<DataTable
				columns={columns}
				data={vehicles}
				isLoading={isLoading}
				emptyMessage="Nenhum veículo encontrado."
				onRowClick={(vehicle) => setEditingVehicle(vehicle)}
				search={{
					value: search,
					onChange: handleSearchChange,
					placeholder: "Buscar por placa, marca ou modelo...",
				}}
				pagination={{ page, pageCount, onPageChange: setPage }}
				mobilePagination={{
					hasMore: page < pageCount,
					onLoadMore: () => setPage((p) => Math.min(p + 1, pageCount)),
				}}
				resetKey={search}
			/>

			{editingVehicle && (
				<VehicleFormPanel
					mode="edit"
					vehicle={editingVehicle}
					open={Boolean(editingVehicle)}
					onOpenChange={(open) => !open && setEditingVehicle(null)}
				/>
			)}
		</>
	);
}
