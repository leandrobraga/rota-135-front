import { useEffect, useState } from "react";
import { useCustomerQuery } from "#/features/customer/queries/use-customer-query";
import type { Customer } from "#/features/customer/types";
import { useDebounce } from "#/hooks/useDebounce";

const PAGE_SIZE = 8;

export function ClientPicker({
	selected,
	onSelect,
}: {
	selected: Customer | null;
	onSelect: (customer: Customer | null) => void;
}) {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const debouncedSearch = useDebounce(search);

	const { data, isLoading } = useCustomerQuery({
		search: debouncedSearch || undefined,
		page,
		pageSize: PAGE_SIZE,
	});

	const [accumulated, setAccumulated] = useState<Customer[]>([]);
	const [lastSearch, setLastSearch] = useState(debouncedSearch);

	if (debouncedSearch !== lastSearch) {
		setLastSearch(debouncedSearch);
		setPage(1);
		setAccumulated([]);
	}

	useEffect(() => {
		if (!data) return;
		setAccumulated((previous) => {
			const seen = new Set(previous.map((customer) => customer.id));
			const additions = data.data.filter((customer) => !seen.has(customer.id));
			return additions.length === 0
				? previous
				: [...previous, ...(additions as Customer[])];
		});
	}, [data]);

	const hasMore = data ? page * PAGE_SIZE < data.total : false;

	if (selected) {
		return (
			<div className="flex items-center justify-between gap-3 rounded-[10px] border-[1.5px] border-neutral-300 px-4 py-3">
				<span className="text-[14.5px] text-navy-800">{selected.name}</span>
				<button
					type="button"
					onClick={() => onSelect(null)}
					className="text-[13px] font-bold text-gold-500"
				>
					Trocar
				</button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<input
				type="text"
				value={search}
				onChange={(event) => setSearch(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === "Enter") event.preventDefault();
				}}
				placeholder="Buscar por nome, e-mail ou CPF..."
				className="h-[46px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500"
			/>

			{isLoading && accumulated.length === 0 && (
				<p className="py-4 text-center text-[13px] text-neutral-600">
					Buscando...
				</p>
			)}

			{!isLoading && debouncedSearch && accumulated.length === 0 && (
				<p className="py-4 text-center text-[13px] text-neutral-600">
					Nenhum cliente encontrado.
				</p>
			)}

			{accumulated.length > 0 && (
				<ul className="flex max-h-[240px] flex-col gap-2 overflow-y-auto">
					{accumulated.map((customer) => (
						<li key={customer.id}>
							<button
								type="button"
								onClick={() => onSelect(customer)}
								className="w-full rounded-[10px] border border-neutral-300 px-4 py-3 text-left hover:border-gold-500"
							>
								<p className="text-[14.5px] font-medium text-navy-800">
									{customer.name}
								</p>
								<p className="text-[12.5px] text-neutral-600">
									{customer.email}
								</p>
							</button>
						</li>
					))}
				</ul>
			)}

			{hasMore && (
				<button
					type="button"
					onClick={() => setPage((p) => p + 1)}
					disabled={isLoading}
					className="h-10 rounded-[10px] border border-neutral-300 font-bold text-[13px] text-navy-800 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{isLoading ? "Carregando..." : "Carregar mais"}
				</button>
			)}
		</div>
	);
}
