import { useState } from "react";
import { ActiveStatusBadge } from "#/components/ActiveStatusBadge";
import { DataTable, type DataTableColumn } from "#/components/DataTable";
import { CustomerFormPanel } from "#/features/customer/components/CustomerFormPanel";
import { useCustomerQuery } from "#/features/customer/queries/use-customer-query";
import type { Customer } from "#/features/customer/types";
import { formatPhoneDisplay } from "#/lib/formatters";

const PAGE_SIZE = 20;

export function CustomerList() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

	const { data, isLoading } = useCustomerQuery({
		search: search || undefined,
		page,
		pageSize: PAGE_SIZE,
	});

	function handleSearchChange(value: string) {
		setSearch(value);
		setPage(1);
	}

	const customers = (data?.data ?? []) as Customer[];
	const pageCount = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

	const columns: DataTableColumn<Customer>[] = [
		{ key: "name", label: "Nome", mobileRole: "title" },
		{ key: "email", label: "E-mail", mobileRole: "meta" },
		{
			key: "phone",
			label: "Telefone",
			mobileRole: "meta",
			render: (customer) =>
				customer.phone ? formatPhoneDisplay(customer.phone) : "",
		},
		{
			key: "active",
			label: "Status",
			mobileRole: "badge",
			render: (customer) => <ActiveStatusBadge active={customer.active} />,
		},
	];

	return (
		<>
			<DataTable
				columns={columns}
				data={customers}
				isLoading={isLoading}
				emptyMessage="Nenhum cliente encontrado."
				onRowClick={(customer) => setEditingCustomer(customer)}
				search={{
					value: search,
					onChange: handleSearchChange,
					placeholder: "Buscar por nome, e-mail ou CPF...",
				}}
				pagination={{ page, pageCount, onPageChange: setPage }}
				mobilePagination={{
					hasMore: page < pageCount,
					onLoadMore: () => setPage((p) => Math.min(p + 1, pageCount)),
				}}
				resetKey={search}
			/>

			{editingCustomer && (
				<CustomerFormPanel
					customer={editingCustomer}
					open={Boolean(editingCustomer)}
					onOpenChange={(open) => !open && setEditingCustomer(null)}
				/>
			)}
		</>
	);
}
