import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import type { z } from "zod";
import { ConfirmDialog } from "#/components/ConfirmDialog";
import { useDeleteCreditMutation } from "#/features/customer/mutations/use-delete-credit-mutation";
import { useGrantCreditMutation } from "#/features/customer/mutations/use-grant-credit-mutation";
import { useCustomerCreditsQuery } from "#/features/customer/queries/use-customer-credits-query";
import {
	type GrantCreditFormData,
	grantCreditSchema,
} from "#/features/customer/schemas/grant-credit.schema";
import type { CustomerCredit } from "#/features/customer/types";
import { getApiErrorMessage } from "#/lib/api-error";
import { useSession } from "#/lib/auth-client";
import { formatCurrencyDisplay } from "#/lib/formatters";

const SOURCE_LABEL: Record<CustomerCredit["source"], string> = {
	CANCELLATION_AUTOMATIC: "Cancelamento automático",
	ADMIN_GRANT: "Concedido manualmente",
};

const SOURCE_STYLE: Record<CustomerCredit["source"], string> = {
	CANCELLATION_AUTOMATIC: "bg-[#F1E6CC] text-gold-500",
	ADMIN_GRANT: "bg-navy-800/10 text-navy-800",
};

function formatCreditDate(value: string): string {
	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(new Date(value));
}

export function CustomerCreditsTab({ customerId }: { customerId: string }) {
	const { data: session } = useSession();
	const [showForm, setShowForm] = useState(false);
	const [deletingCredit, setDeletingCredit] = useState<CustomerCredit | null>(
		null,
	);
	const { data: credits, isLoading } = useCustomerCreditsQuery(customerId);
	const deleteMutation = useDeleteCreditMutation(customerId);

	const canGrant =
		session?.user.role === "ADMIN" || session?.user.role === "FINANCE";

	return (
		<div className="flex flex-col gap-4">
			{canGrant && (
				<div>
					{!showForm && (
						<button
							type="button"
							onClick={() => setShowForm(true)}
							className="h-[42px] rounded-[10px] bg-gold-500 px-4 font-bold text-[14px] text-navy-800"
						>
							+ Conceder crédito
						</button>
					)}
					{showForm && (
						<GrantCreditForm
							customerId={customerId}
							onDone={() => setShowForm(false)}
						/>
					)}
				</div>
			)}

			{isLoading && (
				<p className="py-8 text-center text-[13.5px] text-neutral-600">
					Carregando...
				</p>
			)}

			{!isLoading && credits && credits.length === 0 && (
				<p className="py-8 text-center text-[13.5px] text-neutral-600">
					Nenhum crédito registrado ainda
				</p>
			)}

			{!isLoading && credits && credits.length > 0 && (
				<ul className="flex flex-col gap-3">
					{credits.map((credit) => (
						<li
							key={credit.id}
							className="rounded-xl border border-neutral-300 p-4"
						>
							<div className="flex items-start justify-between gap-2">
								<span className="font-display font-bold text-[17px] text-navy-800">
									{formatCurrencyDisplay(credit.amount)}
								</span>
								<div className="flex items-center gap-2">
									{credit.usedInTripId ? (
										<span className="rounded-full bg-neutral-300 px-2.5 py-1 font-bold text-[11.5px] text-neutral-600">
											Usado
										</span>
									) : (
										<span className="rounded-full bg-sage-100 px-2.5 py-1 font-bold text-[11.5px] text-sage-500">
											Disponível
										</span>
									)}
									{canGrant &&
										credit.source === "ADMIN_GRANT" &&
										!credit.usedInTripId && (
											<button
												type="button"
												onClick={() => setDeletingCredit(credit)}
												aria-label="Excluir crédito"
												className="text-neutral-600 hover:text-[#9C4A3E]"
											>
												<Trash2 size={16} />
											</button>
										)}
								</div>
							</div>
							<div className="mt-2 flex flex-wrap items-center gap-2">
								<span
									className={`rounded-full px-2.5 py-1 font-bold text-[11.5px] ${SOURCE_STYLE[credit.source]}`}
								>
									{SOURCE_LABEL[credit.source]}
								</span>
								<span className="text-[12px] text-neutral-600">
									{formatCreditDate(credit.createdAt)}
								</span>
							</div>
							{credit.reason && (
								<p className="mt-2 text-[13.5px] text-navy-800">
									{credit.reason}
								</p>
							)}
						</li>
					))}
				</ul>
			)}

			<ConfirmDialog
				open={Boolean(deletingCredit)}
				onOpenChange={(open) => !open && setDeletingCredit(null)}
				title="Excluir crédito"
				description={`Tem certeza que deseja excluir o crédito de ${
					deletingCredit ? formatCurrencyDisplay(deletingCredit.amount) : ""
				}? Essa ação não pode ser desfeita.`}
				confirmLabel="Excluir"
				variant="destructive"
				isConfirming={deleteMutation.isPending}
				onConfirm={() => {
					if (!deletingCredit) return;
					deleteMutation.mutate(deletingCredit.id, {
						onSuccess: () => setDeletingCredit(null),
					});
				}}
			/>
		</div>
	);
}

function GrantCreditForm({
	customerId,
	onDone,
}: {
	customerId: string;
	onDone: () => void;
}) {
	const grantMutation = useGrantCreditMutation(customerId);
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<
		z.input<typeof grantCreditSchema>,
		// biome-ignore lint/suspicious/noExplicitAny: RHF context generic, unused
		any,
		z.output<typeof grantCreditSchema>
	>({
		resolver: zodResolver(grantCreditSchema),
		mode: "onChange",
		defaultValues: { amount: "" as unknown as number, reason: "" },
	});
	const registerWithMask = useHookFormMask(register);

	async function onSubmit(values: GrantCreditFormData) {
		try {
			await grantMutation.mutateAsync(values);
			reset();
			onDone();
		} catch (error) {
			setError("root", { message: getApiErrorMessage(error) });
		}
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="mt-3 flex flex-col gap-3 rounded-xl border border-neutral-300 p-4"
			noValidate
		>
			<div>
				<label
					htmlFor="grant-credit-amount"
					className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
				>
					VALOR
				</label>
				<input
					id="grant-credit-amount"
					type="text"
					inputMode="decimal"
					placeholder="0,00"
					className="h-[46px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500"
					{...registerWithMask("amount", "brl-currency", {
						autoUnmask: true,
					})}
				/>
				{errors.amount && (
					<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
						{errors.amount.message}
					</span>
				)}
			</div>
			<div>
				<label
					htmlFor="grant-credit-reason"
					className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
				>
					MOTIVO
				</label>
				<input
					id="grant-credit-reason"
					type="text"
					placeholder="Motivo do crédito"
					className="h-[46px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500"
					{...register("reason")}
				/>
				{errors.reason && (
					<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
						{errors.reason.message}
					</span>
				)}
			</div>
			{errors.root && (
				<div className="rounded-[10px] bg-[#F1E6CC] px-3.5 py-2.5 text-center text-[13px] font-medium text-[#9C4A3E]">
					{errors.root.message}
				</div>
			)}
			<div className="flex gap-2">
				<button
					type="submit"
					disabled={isSubmitting}
					className={`h-[42px] rounded-[10px] px-4 font-bold text-[14px] transition-colors ${
						isSubmitting
							? "cursor-not-allowed bg-[#E8E3D8] text-[#A9A196]"
							: "cursor-pointer bg-gold-500 text-navy-800"
					}`}
				>
					{isSubmitting ? "Salvando..." : "Salvar"}
				</button>
				<button
					type="button"
					onClick={() => {
						reset();
						onDone();
					}}
					className="h-[42px] rounded-[10px] border border-neutral-300 px-4 font-bold text-[14px] text-navy-800"
				>
					Cancelar
				</button>
			</div>
		</form>
	);
}
