import { usePaymentSettingsQuery } from "#/features/payment-settings/queries/use-payment-settings-query";
import { useReconcilePaymentMutation } from "#/features/payments/mutations/use-reconcile-payment-mutation";
import { useReconcileRefundMutation } from "#/features/payments/mutations/use-reconcile-refund-mutation";
import { usePendingPaymentsQuery } from "#/features/payments/queries/use-pending-payments-query";
import { usePendingRefundsQuery } from "#/features/payments/queries/use-pending-refunds-query";
import type { PendingPayment, PendingRefund } from "#/features/payments/types";
import { formatCurrencyDisplay } from "#/lib/formatters";

function hoursSince(createdAt: string): number {
	return (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
}

function formatPendingDuration(hours: number): string {
	if (hours < 1) return `${Math.round(hours * 60)}min`;
	if (hours < 24) return `${Math.round(hours)}h`;
	return `${Math.round(hours / 24)}d`;
}

export function PaymentsPage() {
	const { data: paymentSettings } = usePaymentSettingsQuery();
	const { data: payments, isLoading: isLoadingPayments } =
		usePendingPaymentsQuery();
	const { data: refunds, isLoading: isLoadingRefunds } =
		usePendingRefundsQuery();

	return (
		<div className="flex flex-col gap-6">
			<h1 className="font-display font-bold text-[22px] text-navy-800">
				Pagamentos
			</h1>

			<div>
				<h2 className="mb-3 font-display font-bold text-[17px] text-navy-800">
					Pagamentos pendentes
				</h2>
				<PendingPaymentsSection
					payments={payments}
					isLoading={isLoadingPayments}
					alertHours={paymentSettings?.paymentPendingAlertHours}
				/>
			</div>

			<div>
				<h2 className="mb-3 font-display font-bold text-[17px] text-navy-800">
					Reembolsos pendentes
				</h2>
				<PendingRefundsSection
					refunds={refunds}
					isLoading={isLoadingRefunds}
					alertHours={paymentSettings?.refundPendingAlertHours}
				/>
			</div>
		</div>
	);
}

function PendingPaymentsSection({
	payments,
	isLoading,
	alertHours,
}: {
	payments: PendingPayment[] | undefined;
	isLoading: boolean;
	alertHours: number | undefined;
}) {
	const reconcileMutation = useReconcilePaymentMutation();

	if (isLoading) {
		return (
			<p className="py-6 text-center text-[13.5px] text-neutral-600">
				Carregando...
			</p>
		);
	}

	if (!payments || payments.length === 0) {
		return (
			<p className="py-6 text-center text-[13.5px] text-neutral-600">
				Nenhum pagamento pendente.
			</p>
		);
	}

	return (
		<ul className="flex flex-col gap-2">
			{payments.map((payment) => {
				const pendingHours = hoursSince(payment.createdAt);
				const isLate = alertHours !== undefined && pendingHours > alertHours;
				const isReconciling =
					reconcileMutation.isPending &&
					reconcileMutation.variables === payment.id;

				return (
					<li
						key={payment.id}
						className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-300 p-4"
					>
						<div className="flex flex-wrap items-center gap-3">
							<span className="text-[14.5px] text-navy-800">
								{payment.trip.client.name}
							</span>
							<span className="font-display font-bold text-[16px] text-navy-800">
								{formatCurrencyDisplay(payment.amount)}
							</span>
							<span className="text-[12.5px] text-neutral-600">
								{formatPendingDuration(pendingHours)} pendente
							</span>
							{isLate && (
								<span className="rounded-full bg-[#F1E6CC] px-2.5 py-1 font-bold text-[11.5px] text-[#9C4A3E]">
									Atrasado
								</span>
							)}
						</div>
						<button
							type="button"
							onClick={() => reconcileMutation.mutate(payment.id)}
							disabled={isReconciling}
							className="h-9 rounded-[10px] border border-neutral-300 px-3.5 font-bold text-[13px] text-navy-800 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isReconciling ? "Verificando..." : "Verificar agora"}
						</button>
					</li>
				);
			})}
		</ul>
	);
}

function PendingRefundsSection({
	refunds,
	isLoading,
	alertHours,
}: {
	refunds: PendingRefund[] | undefined;
	isLoading: boolean;
	alertHours: number | undefined;
}) {
	const reconcileMutation = useReconcileRefundMutation();

	if (isLoading) {
		return (
			<p className="py-6 text-center text-[13.5px] text-neutral-600">
				Carregando...
			</p>
		);
	}

	if (!refunds || refunds.length === 0) {
		return (
			<p className="py-6 text-center text-[13.5px] text-neutral-600">
				Nenhum reembolso pendente.
			</p>
		);
	}

	return (
		<ul className="flex flex-col gap-2">
			{refunds.map((refund) => {
				const pendingHours = hoursSince(refund.createdAt);
				const isLate = alertHours !== undefined && pendingHours > alertHours;
				const isReconciling =
					reconcileMutation.isPending &&
					reconcileMutation.variables === refund.id;

				return (
					<li
						key={refund.id}
						className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-300 p-4"
					>
						<div className="flex flex-wrap items-center gap-3">
							<span className="text-[14.5px] text-navy-800">
								{refund.trip.client.name}
							</span>
							<span className="font-display font-bold text-[16px] text-navy-800">
								{formatCurrencyDisplay(refund.amount)}
							</span>
							<span className="text-[12.5px] text-neutral-600">
								{formatPendingDuration(pendingHours)} pendente
							</span>
							{isLate && (
								<span className="rounded-full bg-[#F1E6CC] px-2.5 py-1 font-bold text-[11.5px] text-[#9C4A3E]">
									Atrasado
								</span>
							)}
						</div>
						<button
							type="button"
							onClick={() => reconcileMutation.mutate(refund.id)}
							disabled={isReconciling}
							className="h-9 rounded-[10px] border border-neutral-300 px-3.5 font-bold text-[13px] text-navy-800 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isReconciling ? "Verificando..." : "Verificar agora"}
						</button>
					</li>
				);
			})}
		</ul>
	);
}
