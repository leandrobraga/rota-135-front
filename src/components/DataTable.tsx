import { useEffect, useRef, useState } from "react";
import { useDebounce } from "#/hooks/useDebounce";

export type DataTableColumn<T> = {
	key: keyof T & string;
	label: string;
	mobileRole?: "title" | "badge" | "meta";
	render?: (item: T) => React.ReactNode;
};

export type DataTablePagination = {
	page: number;
	pageCount: number;
	onPageChange: (page: number) => void;
};

export type DataTableMobilePagination = {
	hasMore: boolean;
	onLoadMore: () => void;
	isLoadingMore?: boolean;
};

export type DataTableSearch = {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
};

export function DataTable<T>({
	columns,
	data,
	isLoading,
	emptyMessage,
	onRowClick,
	pagination,
	mobilePagination,
	// Sinaliza troca de filtro (ex.: termo de busca) pra zerar o acúmulo de
	// cards do "Carregar mais" no mobile. Basta trocar o valor (ex.: o
	// próprio termo de busca) quando o filtro mudar.
	resetKey,
	search,
}: {
	columns: DataTableColumn<T>[];
	data: T[];
	isLoading?: boolean;
	emptyMessage: string;
	onRowClick?: (item: T) => void;
	pagination?: DataTablePagination;
	mobilePagination?: DataTableMobilePagination;
	resetKey?: string | number;
	search?: DataTableSearch;
}) {
	const titleColumns = columns.filter(
		(column) => column.mobileRole === "title",
	);
	const badgeColumns = columns.filter(
		(column) => column.mobileRole === "badge",
	);
	const metaColumns = columns.filter((column) => column.mobileRole === "meta");

	const [accumulated, setAccumulated] = useState<T[]>(data);
	const [lastResetKey, setLastResetKey] = useState(resetKey);

	if (resetKey !== lastResetKey) {
		setLastResetKey(resetKey);
		setAccumulated(data);
	}

	useEffect(() => {
		if (!mobilePagination) {
			setAccumulated(data);
			return;
		}
		setAccumulated((previous) => {
			const seen = new Set(previous);
			const additions = data.filter((item) => !seen.has(item));
			return additions.length === 0 ? previous : [...previous, ...additions];
		});
	}, [data, mobilePagination]);

	const mobileData = mobilePagination ? accumulated : data;

	function cell(item: T, column: DataTableColumn<T>) {
		return column.render ? column.render(item) : String(item[column.key] ?? "");
	}

	if (isLoading) {
		return (
			<div className="overflow-hidden rounded-2xl border border-neutral-300 bg-white">
				<div className="hidden grid-cols-[1fr] gap-px lg:grid">
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
							key={i}
							className="h-14 animate-pulse bg-cream-50"
						/>
					))}
				</div>
				<div className="flex flex-col gap-3 p-4 lg:hidden">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
							key={i}
							className="h-20 animate-pulse rounded-xl bg-cream-50"
						/>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{search && <DataTableSearchInput search={search} />}

			{data.length === 0 ? (
				<div className="flex h-40 items-center justify-center rounded-2xl border border-neutral-300 bg-white text-center text-[13.5px] text-neutral-600">
					{emptyMessage}
				</div>
			) : (
				<>
					<div className="hidden overflow-hidden rounded-2xl border border-neutral-300 bg-white lg:block">
						<table className="w-full border-collapse">
							<thead>
								<tr className="border-neutral-300 border-b bg-cream-50">
									{columns.map((column) => (
										<th
											key={column.key}
											className="px-5.5 py-3.5 text-left font-bold text-[12px] text-neutral-500 tracking-[0.3px]"
										>
											{column.label.toUpperCase()}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{data.map((item, index) => (
									<tr
										// biome-ignore lint/suspicious/noArrayIndexKey: rows have no guaranteed stable id in generic data
										key={index}
										onClick={() => onRowClick?.(item)}
										className={`border-[#F0EDE5] border-b last:border-b-0 ${
											onRowClick ? "cursor-pointer hover:bg-cream-50" : ""
										}`}
									>
										{columns.map((column) => (
											<td
												key={column.key}
												className="px-5.5 py-4 text-[13px] text-navy-800"
											>
												{cell(item, column)}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{pagination && pagination.pageCount > 1 && (
						<DesktopPagination pagination={pagination} />
					)}

					<div className="flex flex-col gap-3 lg:hidden">
						{mobileData.map((item, index) => (
							<button
								type="button"
								// biome-ignore lint/suspicious/noArrayIndexKey: rows have no guaranteed stable id in generic data
								key={index}
								onClick={() => onRowClick?.(item)}
								disabled={!onRowClick}
								className="flex flex-col gap-1.5 rounded-xl border border-neutral-300 bg-white p-4 text-left"
							>
								<div className="flex items-start justify-between gap-2">
									<div className="flex flex-col gap-1">
										{titleColumns.map((column) => (
											<div
												key={column.key}
												className="font-bold text-[13.5px] text-navy-800"
											>
												{cell(item, column)}
											</div>
										))}
									</div>
									{badgeColumns.length > 0 && (
										<div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
											{badgeColumns.map((column) => (
												<div key={column.key}>{cell(item, column)}</div>
											))}
										</div>
									)}
								</div>
								{metaColumns.length > 0 && (
									<div className="flex flex-wrap items-center gap-x-1.5 text-[12.5px] text-neutral-600">
										{metaColumns.map((column, i) => (
											<span
												key={column.key}
												className="flex items-center gap-1.5"
											>
												{i > 0 && <span className="text-neutral-400">·</span>}
												{cell(item, column)}
											</span>
										))}
									</div>
								)}
							</button>
						))}

						{mobilePagination?.hasMore && (
							<button
								type="button"
								onClick={mobilePagination.onLoadMore}
								disabled={mobilePagination.isLoadingMore}
								className="h-11 rounded-[10px] border border-neutral-300 bg-white font-bold text-[13.5px] text-navy-800 disabled:opacity-60"
							>
								{mobilePagination.isLoadingMore
									? "Carregando..."
									: "Carregar mais"}
							</button>
						)}
					</div>
				</>
			)}
		</div>
	);
}

function DataTableSearchInput({ search }: { search: DataTableSearch }) {
	const [term, setTerm] = useState(search.value);
	const debounced = useDebounce(term, 350);
	const onChangeRef = useRef(search.onChange);
	onChangeRef.current = search.onChange;

	useEffect(() => {
		onChangeRef.current(debounced);
	}, [debounced]);

	return (
		<input
			type="text"
			value={term}
			onChange={(event) => setTerm(event.target.value)}
			placeholder={search.placeholder}
			className="h-11 w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500 lg:max-w-xs"
		/>
	);
}

function DesktopPagination({
	pagination,
}: {
	pagination: DataTablePagination;
}) {
	const { page, pageCount, onPageChange } = pagination;

	return (
		<div className="hidden items-center justify-between lg:flex">
			<button
				type="button"
				onClick={() => onPageChange(page - 1)}
				disabled={page <= 1}
				className="h-9 rounded-[9px] border border-neutral-300 px-3.5 font-semibold text-[12.5px] text-navy-800 disabled:opacity-40"
			>
				Anterior
			</button>
			<span className="text-[12.5px] text-neutral-600">
				Página {page} de {pageCount}
			</span>
			<button
				type="button"
				onClick={() => onPageChange(page + 1)}
				disabled={page >= pageCount}
				className="h-9 rounded-[9px] border border-neutral-300 px-3.5 font-semibold text-[12.5px] text-navy-800 disabled:opacity-40"
			>
				Próximo
			</button>
		</div>
	);
}
