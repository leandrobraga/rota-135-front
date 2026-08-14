import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import type { z } from "zod";
import { ConfirmDialog } from "#/components/ConfirmDialog";
import { FormPanel } from "#/components/FormPanel";
import { useCustomerByIdQuery } from "#/features/customer/queries/use-customer-by-id-query";
import { useTripSettingsQuery } from "#/features/trip-settings/queries/use-trip-settings-query";
import { calculateRefundEligibility } from "#/features/trips/lib/calculate-refund-eligibility";
import { useCancelTripMutation } from "#/features/trips/mutations/use-cancel-trip-mutation";
import {
	type CancelTripFormData,
	cancelTripSchema,
} from "#/features/trips/schemas/cancel-trip.schema";
import type { CancelTripInput, Trip } from "#/features/trips/types";
import { getApiErrorMessage } from "#/lib/api-error";
import { formatCurrencyDisplay } from "#/lib/formatters";

const PIX_KEY_TYPE_LABEL: Record<
	NonNullable<CancelTripInput["pixKeyType"]>,
	string
> = {
	CPF: "CPF",
	CNPJ: "CNPJ",
	PHONE: "Telefone",
	EMAIL: "E-mail",
	RANDOM: "Chave aleatória",
	BR_CODE: "Copia e cola",
};

export function CancelTripDialog({
	trip,
	open,
	onOpenChange,
}: {
	trip: Trip;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { data: tripSettings } = useTripSettingsQuery();

	if (!tripSettings) return null;

	const eligibility = calculateRefundEligibility(
		trip.scheduledAt,
		tripSettings.fullRefundWindowHours,
		tripSettings.partialRefundWindowHours,
	);

	if (eligibility === "NONE") {
		return (
			<SimpleCancelDialog trip={trip} open={open} onOpenChange={onOpenChange} />
		);
	}

	return (
		<EligibleCancelDialog
			trip={trip}
			eligibility={eligibility}
			partialRefundPercentage={tripSettings.partialRefundPercentage}
			open={open}
			onOpenChange={onOpenChange}
		/>
	);
}

function SimpleCancelDialog({
	trip,
	open,
	onOpenChange,
}: {
	trip: Trip;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const cancelMutation = useCancelTripMutation(trip.id);

	return (
		<ConfirmDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Cancelar corrida"
			description="Tem certeza que deseja cancelar esta corrida? Essa ação não pode ser desfeita."
			confirmLabel="Cancelar corrida"
			cancelLabel="Voltar"
			variant="destructive"
			isConfirming={cancelMutation.isPending}
			onConfirm={() => {
				cancelMutation.mutate({}, { onSuccess: () => onOpenChange(false) });
			}}
		/>
	);
}

function EligibleCancelDialog({
	trip,
	eligibility,
	partialRefundPercentage,
	open,
	onOpenChange,
}: {
	trip: Trip;
	eligibility: "FULL" | "PARTIAL";
	partialRefundPercentage: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const cancelMutation = useCancelTripMutation(trip.id);
	const { data: customer } = useCustomerByIdQuery(trip.client.id);

	const [choice, setChoice] = useState<"REFUND" | "CREDIT">("REFUND");
	const [useNewPixKey, setUseNewPixKey] = useState(false);
	const [rootError, setRootError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<
		z.input<typeof cancelTripSchema>,
		// biome-ignore lint/suspicious/noExplicitAny: RHF context generic, unused
		any,
		z.output<typeof cancelTripSchema>
	>({
		resolver: zodResolver(cancelTripSchema),
		mode: "onChange",
		defaultValues: { pixKeyType: "CPF" },
	});
	const registerWithMask = useHookFormMask(register);

	const pixKeyType = watch("pixKeyType") ?? "CPF";

	const needsPixKey = choice === "REFUND" && eligibility === "PARTIAL";
	const savedPixKey = customer?.pixKey ?? null;
	const needsNewPixKeyInput = needsPixKey && (!savedPixKey || useNewPixKey);

	const partialAmount = (
		(Number(trip.price) * partialRefundPercentage) /
		100
	).toString();

	function resetAndClose() {
		reset({ pixKeyType: "CPF" });
		setChoice("REFUND");
		setUseNewPixKey(false);
		setRootError(null);
		onOpenChange(false);
	}

	async function onSubmit(values: CancelTripFormData) {
		setRootError(null);

		const body: CancelTripInput = { choice };
		if (needsNewPixKeyInput) {
			body.pixKey = values.pixKey;
			body.pixKeyType = values.pixKeyType;
		}

		cancelMutation.mutate(body, {
			onSuccess: () => resetAndClose(),
			onError: (err) => setRootError(getApiErrorMessage(err)),
		});
	}

	function pixKeyRegister() {
		if (pixKeyType === "CPF") {
			return registerWithMask("pixKey", "cpf", { autoUnmask: true });
		}
		if (pixKeyType === "CNPJ") {
			return registerWithMask("pixKey", "cnpj", { autoUnmask: true });
		}
		if (pixKeyType === "PHONE") {
			return registerWithMask("pixKey", ["(99) 9999-9999", "(99) 99999-9999"], {
				autoUnmask: true,
			});
		}
		return register("pixKey");
	}

	return (
		<FormPanel
			open={open}
			onOpenChange={(next) => !next && resetAndClose()}
			title="Cancelar corrida"
			footer={
				<>
					<button
						type="submit"
						form="cancel-trip-form"
						disabled={
							cancelMutation.isPending ||
							isSubmitting ||
							(needsNewPixKeyInput && !watch("pixKey"))
						}
						className="h-[46px] rounded-[10px] bg-[#9C4A3E] font-bold text-[14.5px] text-white disabled:cursor-not-allowed disabled:opacity-60"
					>
						{cancelMutation.isPending ? "Aguarde..." : "Cancelar corrida"}
					</button>
					<button
						type="button"
						onClick={resetAndClose}
						className="h-[46px] rounded-[10px] border border-neutral-300 bg-white font-bold text-[14.5px] text-navy-800"
					>
						Voltar
					</button>
				</>
			}
		>
			<form
				id="cancel-trip-form"
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-5"
				noValidate
			>
				<p className="text-[13.5px] text-neutral-600">
					Esta corrida é elegível para{" "}
					{eligibility === "FULL" ? "reembolso total" : "reembolso parcial"}.
					Valor da corrida: {formatCurrencyDisplay(trip.price)}.
					{eligibility === "PARTIAL" && (
						<>
							{" "}
							Valor reembolsável: {formatCurrencyDisplay(partialAmount)} (
							{partialRefundPercentage}%).
						</>
					)}
				</p>

				<div>
					<span className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600">
						O QUE FAZER
					</span>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => setChoice("REFUND")}
							className={`h-[42px] flex-1 rounded-[10px] font-bold text-[14px] transition-colors ${
								choice === "REFUND"
									? "bg-gold-500 text-navy-800"
									: "border border-neutral-300 bg-white text-navy-800"
							}`}
						>
							Reembolso
						</button>
						<button
							type="button"
							onClick={() => setChoice("CREDIT")}
							className={`h-[42px] flex-1 rounded-[10px] font-bold text-[14px] transition-colors ${
								choice === "CREDIT"
									? "bg-gold-500 text-navy-800"
									: "border border-neutral-300 bg-white text-navy-800"
							}`}
						>
							Crédito
						</button>
					</div>
				</div>

				{needsPixKey && (
					<div className="flex flex-col gap-3">
						{savedPixKey && !useNewPixKey ? (
							<div className="flex items-center justify-between rounded-[10px] border border-neutral-300 px-4 py-3">
								<span className="text-[14px] text-navy-800">
									Chave PIX: •••• {savedPixKey.slice(-4)}
								</span>
								<button
									type="button"
									onClick={() => setUseNewPixKey(true)}
									className="text-[13px] font-bold text-gold-500"
								>
									Usar outra chave
								</button>
							</div>
						) : (
							<>
								<div>
									<label
										htmlFor="cancel-pix-key-type"
										className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
									>
										TIPO DE CHAVE
									</label>
									<select
										id="cancel-pix-key-type"
										className="h-11 w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500"
										{...register("pixKeyType", {
											onChange: () => setValue("pixKey", ""),
										})}
									>
										{Object.entries(PIX_KEY_TYPE_LABEL).map(
											([value, label]) => (
												<option key={value} value={value}>
													{label}
												</option>
											),
										)}
									</select>
								</div>
								<div>
									<label
										htmlFor="cancel-pix-key"
										className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
									>
										CHAVE PIX
									</label>
									<input
										id="cancel-pix-key"
										type={pixKeyType === "EMAIL" ? "email" : "text"}
										placeholder="Chave PIX do cliente"
										className="h-[46px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500"
										{...pixKeyRegister()}
									/>
									{errors.pixKey && (
										<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
											{errors.pixKey.message}
										</span>
									)}
								</div>
							</>
						)}
					</div>
				)}

				{rootError && (
					<div className="rounded-[10px] bg-[#F1E6CC] px-3.5 py-2.5 text-center text-[13px] font-medium text-[#9C4A3E]">
						{rootError}
					</div>
				)}
			</form>
		</FormPanel>
	);
}
