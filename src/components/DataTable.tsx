export type DataTableColumn<T> = {
	key: keyof T & string;
	label: string;
	primary?: boolean;
	render?: (item: T) => React.ReactNode;
};

export function DataTable<T>({
	columns,
	data,
	isLoading,
	emptyMessage,
	onRowClick,
}: {
	columns: DataTableColumn<T>[];
	data: T[];
	isLoading?: boolean;
	emptyMessage: string;
	onRowClick?: (item: T) => void;
}) {
	const primaryColumns = columns.filter((column) => column.primary);

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

	if (data.length === 0) {
		return (
			<div className="flex h-40 items-center justify-center rounded-2xl border border-neutral-300 bg-white text-center text-[13.5px] text-neutral-600">
				{emptyMessage}
			</div>
		);
	}

	return (
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

			<div className="flex flex-col gap-3 lg:hidden">
				{data.map((item, index) => (
					<button
						type="button"
						// biome-ignore lint/suspicious/noArrayIndexKey: rows have no guaranteed stable id in generic data
						key={index}
						onClick={() => onRowClick?.(item)}
						disabled={!onRowClick}
						className="flex flex-col gap-1.5 rounded-xl border border-neutral-300 bg-white p-4 text-left"
					>
						{primaryColumns.map((column, columnIndex) => (
							<div
								key={column.key}
								className={
									columnIndex === 0
										? "font-bold text-[13.5px] text-navy-800"
										: "text-[13px] text-neutral-600"
								}
							>
								{cell(item, column)}
							</div>
						))}
					</button>
				))}
			</div>
		</>
	);
}
