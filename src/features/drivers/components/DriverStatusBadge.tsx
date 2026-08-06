import type { Driver } from "#/features/drivers/types";

const APPROVAL_STATUS_STYLE: Record<Driver["approvalStatus"], string> = {
	PENDING: "bg-[#F1E6CC] text-gold-500",
	APPROVED: "bg-sage-100 text-sage-500",
	REJECTED: "bg-[#F1E6CC] text-[#9C4A3E]",
	SUSPENDED: "bg-[#F1E6CC] text-[#9C4A3E]",
};

const APPROVAL_STATUS_LABEL: Record<Driver["approvalStatus"], string> = {
	PENDING: "Pendente",
	APPROVED: "Aprovado",
	REJECTED: "Rejeitado",
	SUSPENDED: "Suspenso",
};

export function DriverStatusBadge({
	active,
	approvalStatus,
}: {
	active: boolean;
	approvalStatus: Driver["approvalStatus"];
}) {
	// active=false tem prioridade visual sobre approvalStatus.
	if (!active) {
		return (
			<span className="rounded-full bg-neutral-300 px-2.5 py-1 font-bold text-[11.5px] text-neutral-600">
				Desativado
			</span>
		);
	}

	return (
		<span
			className={`rounded-full px-2.5 py-1 font-bold text-[11.5px] ${APPROVAL_STATUS_STYLE[approvalStatus]}`}
		>
			{APPROVAL_STATUS_LABEL[approvalStatus]}
		</span>
	);
}
