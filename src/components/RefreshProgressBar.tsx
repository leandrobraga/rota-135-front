export function RefreshProgressBar({
	live,
	dataUpdatedAt,
	durationMs = 15000,
}: {
	live: boolean;
	dataUpdatedAt: number;
	durationMs?: number;
}) {
	if (!live) return null;

	return (
		<div className="h-[3px] w-full overflow-hidden rounded-full bg-neutral-300">
			<div
				key={dataUpdatedAt}
				className="h-full origin-left rounded-full bg-gold-500"
				style={{
					animation: `progressShrink ${durationMs}ms linear forwards`,
				}}
			/>
		</div>
	);
}
