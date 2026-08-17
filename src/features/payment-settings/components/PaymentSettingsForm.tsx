import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormRegisterReturn, useForm } from "react-hook-form";
import type { z } from "zod";
import { useUpdatePaymentSettingsMutation } from "#/features/payment-settings/mutations/use-update-payment-settings-mutation";
import { usePaymentSettingsQuery } from "#/features/payment-settings/queries/use-payment-settings-query";
import {
	type UpdatePaymentSettingsFormData,
	updatePaymentSettingsSchema,
} from "#/features/payment-settings/schemas/update-payment-settings.schema";
import { getApiFieldError } from "#/lib/api-error";

const PAYMENT_SETTINGS_FORM_FIELDS = [
	"paymentPendingAlertHours",
	"refundPendingAlertHours",
] as const;
type PaymentSettingsFormField = (typeof PAYMENT_SETTINGS_FORM_FIELDS)[number];

function isPaymentSettingsFormField(
	field: string | undefined,
): field is PaymentSettingsFormField {
	return (PAYMENT_SETTINGS_FORM_FIELDS as readonly string[]).includes(
		field ?? "",
	);
}

const FIELD_LABELS: Record<PaymentSettingsFormField, string> = {
	paymentPendingAlertHours: "Alerta de pagamento pendente (horas)",
	refundPendingAlertHours: "Alerta de reembolso pendente (horas)",
};

export function PaymentSettingsForm() {
	const { data: paymentSettings, isLoading } = usePaymentSettingsQuery();
	const updateMutation = useUpdatePaymentSettingsMutation();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<
		z.input<typeof updatePaymentSettingsSchema>,
		// biome-ignore lint/suspicious/noExplicitAny: RHF context generic, unused
		any,
		z.output<typeof updatePaymentSettingsSchema>
	>({
		resolver: zodResolver(updatePaymentSettingsSchema),
		mode: "onChange",
		values: paymentSettings
			? {
					paymentPendingAlertHours: paymentSettings.paymentPendingAlertHours,
					refundPendingAlertHours: paymentSettings.refundPendingAlertHours,
				}
			: undefined,
	});

	async function onSubmit(values: UpdatePaymentSettingsFormData) {
		try {
			await updateMutation.mutateAsync(values);
		} catch (error) {
			const { field, message } = getApiFieldError(error);
			if (isPaymentSettingsFormField(field)) {
				setError(field, { message });
			} else {
				setError("root", { message });
			}
		}
	}

	if (isLoading) {
		return (
			<div className="flex h-40 items-center justify-center rounded-2xl border border-neutral-300 bg-white text-[13.5px] text-neutral-600">
				Carregando...
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-5"
			noValidate
		>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{PAYMENT_SETTINGS_FORM_FIELDS.map((field) => (
					<TextField
						key={field}
						id={field}
						label={FIELD_LABELS[field]}
						error={errors[field]?.message}
						register={register(field)}
					/>
				))}
			</div>

			{errors.root && (
				<div className="rounded-[10px] bg-[#F1E6CC] px-3.5 py-2.5 text-center text-[13px] font-medium text-[#9C4A3E]">
					{errors.root.message}
				</div>
			)}

			<button
				type="submit"
				disabled={isSubmitting}
				className={`h-[50px] w-full rounded-[10px] font-bold text-[15px] transition-colors lg:w-auto lg:self-start lg:px-8 ${
					isSubmitting
						? "cursor-not-allowed bg-[#E8E3D8] text-[#A9A196]"
						: "cursor-pointer bg-gold-500 text-navy-800"
				}`}
			>
				{isSubmitting ? "Salvando..." : "Salvar"}
			</button>
		</form>
	);
}

function TextField({
	id,
	label,
	error,
	register,
}: {
	id: string;
	label: string;
	error?: string;
	register: UseFormRegisterReturn;
}) {
	return (
		<div>
			<label
				htmlFor={id}
				className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
			>
				{label.toUpperCase()}
			</label>
			<input
				id={id}
				type="number"
				step="1"
				className="h-[50px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500"
				{...register}
			/>
			{error && (
				<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
					{error}
				</span>
			)}
		</div>
	);
}
