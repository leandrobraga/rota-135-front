export function ActiveStatusBadge({ active }: { active: boolean }) {
	if (!active) {
		return (
			<span className="rounded-full bg-neutral-300 px-2.5 py-1 font-bold text-[11.5px] text-neutral-600">
				Desativado
			</span>
		);
	}

	return (
		<span className="rounded-full bg-sage-100 px-2.5 py-1 font-bold text-[11.5px] text-sage-500">
			Ativo
		</span>
	);
}
