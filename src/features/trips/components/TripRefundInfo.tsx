import type { Trip } from "#/features/trips/types";
import { formatCurrencyDisplay } from "#/lib/formatters";

type TripRefund = NonNullable<Trip["refund"]>;

const METHOD_LABEL: Record<TripRefund["method"], string> = {
	REFUND_FULL: "Reembolso total",
	REFUND_PARTIAL: "Reembolso parcial",
	CREDIT: "Crédito",
};

const STATUS_LABEL: Record<TripRefund["status"], string> = {
	PENDING: "Pendente",
	COMPLETED: "Concluído",
	FAILED: "Falhou",
};

const STATUS_STYLE: Record<TripRefund["status"], string> = {
	PENDING: "bg-[#F1E6CC] text-gold-500",
	COMPLETED: "bg-sage-100 text-sage-500",
	FAILED: "bg-[#F1E6CC] text-[#9C4A3E]",
};

export function TripRefundInfo({ refund }: { refund: Trip["refund"] }) {
	if (!refund) return null;

	return (
		<div className="rounded-xl border border-neutral-300 p-4">
			<div className="flex items-start justify-between gap-2">
				<span className="font-display font-bold text-[17px] text-navy-800">
					{formatCurrencyDisplay(refund.amount)}
				</span>
				<span
					className={`rounded-full px-2.5 py-1 font-bold text-[11.5px] ${STATUS_STYLE[refund.status]}`}
				>
					{STATUS_LABEL[refund.status]}
				</span>
			</div>
			<p className="mt-1 text-[13.5px] text-neutral-600">
				{METHOD_LABEL[refund.method]}
			</p>
			{refund.status === "FAILED" && refund.failureReason && (
				<p className="mt-2 text-[13px] text-[#9C4A3E]">
					{refund.failureReason}
				</p>
			)}
		</div>
	);
}
