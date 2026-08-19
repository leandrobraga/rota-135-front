import type { Trip } from "#/features/trips/types";

type Payment = NonNullable<Trip["payment"]>;

const PAYMENT_STATUS_STYLE: Record<Payment["status"], string> = {
	PENDING: "bg-gold-500 text-white",
	PAID: "",
	FAILED: "bg-[#F1E6CC] text-[#9C4A3E]",
	EXPIRED: "bg-[#F1E6CC] text-[#9C4A3E]",
	REFUNDED: "bg-[#F1E6CC] text-[#9C4A3E]",
	PARTIALLY_REFUNDED: "bg-[#F1E6CC] text-[#9C4A3E]",
};

const PAYMENT_STATUS_LABEL: Record<Payment["status"], string> = {
	PENDING: "Pagamento pendente",
	PAID: "",
	FAILED: "Pagamento falhou",
	EXPIRED: "Pagamento expirado",
	REFUNDED: "Reembolsado",
	PARTIALLY_REFUNDED: "Parcialmente reembolsado",
};

export function PaymentStatusBadge({ payment }: { payment: Trip["payment"] }) {
	if (!payment || payment.status === "PAID") return null;

	return (
		<span
			className={`rounded-full px-2.5 py-1 font-bold text-[11.5px] ${PAYMENT_STATUS_STYLE[payment.status]}`}
		>
			{PAYMENT_STATUS_LABEL[payment.status]}
		</span>
	);
}
