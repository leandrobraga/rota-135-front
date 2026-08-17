import type { ApiResponse } from "#/lib/api-client/typed-client";

type RawPendingPayment = ApiResponse<"getPaymentsPending">[number];
type RawPendingRefund = ApiResponse<"getRefundsPending">[number];

// amount/createdAt/paidAt/updatedAt vêm unknown do gerador (Decimal/Date não
// representáveis em JSON Schema) — sabemos que o valor real de fio é string
// numérica / string ISO.
export type PendingPayment = Omit<
	RawPendingPayment,
	"amount" | "paidAt" | "createdAt" | "updatedAt"
> & {
	amount: string;
	paidAt: string | null;
	createdAt: string;
	updatedAt: string;
};

export type PendingRefund = Omit<
	RawPendingRefund,
	"amount" | "createdAt" | "updatedAt"
> & {
	amount: string;
	createdAt: string;
	updatedAt: string;
};
