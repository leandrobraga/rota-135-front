import { useState } from "react";
import { ConfirmDialog } from "#/components/ConfirmDialog";
import { DataTable, type DataTableColumn } from "#/components/DataTable";
import { DriverFormPanel } from "#/features/drivers/components/DriverFormPanel";
import { DriverStatusBadge } from "#/features/drivers/components/DriverStatusBadge";
import { useUpdateApprovalStatusMutation } from "#/features/drivers/mutations/use-update-approval-status-mutation";
import { useDriversQuery } from "#/features/drivers/queries/use-drivers-query";
import type { Driver } from "#/features/drivers/types";
import { formatPhoneDisplay } from "#/lib/formatters";

const PAGE_SIZE = 20;

export function DriversList() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
	const [rejectingDriver, setRejectingDriver] = useState<Driver | null>(null);

	const { data, isLoading } = useDriversQuery({
		search: search || undefined,
		page,
		pageSize: PAGE_SIZE,
	});

	const approveMutation = useUpdateApprovalStatusMutation(
		rejectingDriver?.id ?? "",
	);

	function handleSearchChange(value: string) {
		setSearch(value);
		setPage(1);
	}

	const drivers = (data?.data ?? []) as Driver[];
	const pageCount = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

	const columns: DataTableColumn<Driver>[] = [
		{ key: "name", label: "Nome", mobileRole: "title" },
		{
			key: "phone",
			label: "Telefone",
			mobileRole: "meta",
			render: (driver) =>
				driver.phone ? formatPhoneDisplay(driver.phone) : "",
		},
		{
			key: "licenseNumber",
			label: "CNH",
			mobileRole: "meta",
		},
		{
			key: "approvalStatus",
			label: "Status",
			mobileRole: "badge",
			render: (driver) => (
				<DriverStatusBadge
					active={driver.active}
					approvalStatus={driver.approvalStatus}
				/>
			),
		},
		{
			key: "id",
			label: "Ações",
			mobileRole: "actions",
			render: (driver) =>
				driver.approvalStatus === "PENDING" && driver.active ? (
					<DriverQuickActions
						driver={driver}
						onReject={() => setRejectingDriver(driver)}
					/>
				) : null,
		},
	];

	return (
		<>
			<DataTable
				columns={columns}
				data={drivers}
				isLoading={isLoading}
				emptyMessage="Nenhum motorista encontrado."
				onRowClick={(driver) => setEditingDriver(driver)}
				search={{
					value: search,
					onChange: handleSearchChange,
					placeholder: "Buscar por nome, e-mail, CPF ou CNH...",
				}}
				pagination={{ page, pageCount, onPageChange: setPage }}
				mobilePagination={{
					hasMore: page < pageCount,
					onLoadMore: () => setPage((p) => Math.min(p + 1, pageCount)),
				}}
				resetKey={search}
			/>

			{editingDriver && (
				<DriverFormPanel
					mode="edit"
					driver={editingDriver}
					open={Boolean(editingDriver)}
					onOpenChange={(open) => !open && setEditingDriver(null)}
				/>
			)}

			<ConfirmDialog
				open={Boolean(rejectingDriver)}
				onOpenChange={(open) => !open && setRejectingDriver(null)}
				title="Rejeitar motorista"
				description={`Tem certeza que deseja rejeitar o cadastro de ${rejectingDriver?.name}?`}
				confirmLabel="Rejeitar"
				variant="destructive"
				isConfirming={approveMutation.isPending}
				onConfirm={() => {
					approveMutation.mutate("REJECTED", {
						onSuccess: () => setRejectingDriver(null),
					});
				}}
			/>
		</>
	);
}

function DriverQuickActions({
	driver,
	onReject,
}: {
	driver: Driver;
	onReject: () => void;
}) {
	const approveMutation = useUpdateApprovalStatusMutation(driver.id);

	return (
		<span className="flex items-center gap-1.5">
			<button
				type="button"
				disabled={approveMutation.isPending}
				onClick={(event) => {
					event.stopPropagation();
					approveMutation.mutate("APPROVED");
				}}
				className="rounded-full bg-sage-500 px-2.5 py-1 font-bold text-[11.5px] text-white disabled:opacity-60"
			>
				Aprovar
			</button>
			<button
				type="button"
				onClick={(event) => {
					event.stopPropagation();
					onReject();
				}}
				className="rounded-full border border-neutral-300 px-2.5 py-1 font-bold text-[11.5px] text-navy-800"
			>
				Rejeitar
			</button>
		</span>
	);
}
