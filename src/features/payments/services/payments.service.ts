import type { PendingPayment, PendingRefund } from "#/features/payments/types";
import { typedApi } from "#/lib/api-client/typed-client";

export const PaymentsService = {
	listPendingPayments: async (): Promise<PendingPayment[]> => {
		const { data } = await typedApi.get("/payments/pending");
		return data as PendingPayment[];
	},

	listPendingRefunds: async (): Promise<PendingRefund[]> => {
		const { data } = await typedApi.get("/refunds/pending");
		return data as PendingRefund[];
	},

	reconcilePayment: async (id: string): Promise<PendingPayment> => {
		const { data } = await typedApi.post("/payments/{id}/reconcile", {
			params: { path: { id } },
		});
		return data as PendingPayment;
	},

	reconcileRefund: async (id: string): Promise<PendingRefund> => {
		const { data } = await typedApi.post("/refunds/{id}/reconcile", {
			params: { path: { id } },
		});
		return data as PendingRefund;
	},
};
