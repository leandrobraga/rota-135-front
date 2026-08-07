import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type UseFormRegisterReturn, useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import { ConfirmDialog } from "#/components/ConfirmDialog";
import { FormPanel } from "#/components/FormPanel";
import { useActivateCustomerMutation } from "#/features/customer/mutations/use-activate-customer-mutation";
import { useDeactivateCustomerMutation } from "#/features/customer/mutations/use-deactivate-customer-mutation";
import { useUpdateCustomerMutation } from "#/features/customer/mutations/use-update-customer-mutation";
import {
	type UpdateCustomerFormData,
	updateCustomerSchema,
} from "#/features/customer/schemas/update-customer.schema";
import type { Customer } from "#/features/customer/types";
import { getApiFieldError } from "#/lib/api-error";

const UPDATE_CUSTOMER_FORM_FIELDS = [
	"name",
	"phone",
	"emergencyContactName",
	"emergencyContactPhone",
] as const;
type UpdateCustomerFormField = (typeof UPDATE_CUSTOMER_FORM_FIELDS)[number];

function isUpdateCustomerFormField(
	field: string | undefined,
): field is UpdateCustomerFormField {
	return (UPDATE_CUSTOMER_FORM_FIELDS as readonly string[]).includes(
		field ?? "",
	);
}

export function CustomerFormPanel({
	customer,
	open,
	onOpenChange,
}: {
	customer: Customer;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [confirmingDeactivate, setConfirmingDeactivate] = useState(false);
	const updateMutation = useUpdateCustomerMutation(customer.id);
	const deactivateMutation = useDeactivateCustomerMutation(customer.id);
	const activateMutation = useActivateCustomerMutation(customer.id);
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<UpdateCustomerFormData>({
		resolver: zodResolver(updateCustomerSchema),
		mode: "onChange",
		defaultValues: {
			name: customer.name,
			phone: customer.phone ?? "",
			emergencyContactName: customer.emergencyContactName ?? "",
			emergencyContactPhone: customer.emergencyContactPhone ?? "",
		},
	});
	const registerWithMask = useHookFormMask(register);

	async function onSubmit(values: UpdateCustomerFormData) {
		try {
			await updateMutation.mutateAsync(values);
			onOpenChange(false);
		} catch (error) {
			const { field, message } = getApiFieldError(error);
			if (isUpdateCustomerFormField(field)) {
				setError(field, { message });
			} else {
				setError("root", { message });
			}
		}
	}

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen) reset();
		onOpenChange(nextOpen);
	}

	return (
		<>
			<FormPanel
				open={open}
				onOpenChange={handleOpenChange}
				title="Editar cliente"
				footer={
					<>
						<button
							type="submit"
							form="edit-customer-form"
							disabled={isSubmitting}
							className={`h-[50px] rounded-[10px] font-bold text-[15px] transition-colors ${
								isSubmitting
									? "cursor-not-allowed bg-[#E8E3D8] text-[#A9A196]"
									: "cursor-pointer bg-gold-500 text-navy-800"
							}`}
						>
							{isSubmitting ? "Salvando..." : "Salvar alterações"}
						</button>
						{customer.active ? (
							<button
								type="button"
								onClick={() => setConfirmingDeactivate(true)}
								className="h-[50px] rounded-[10px] border border-[#9C4A3E] font-bold text-[15px] text-[#9C4A3E]"
							>
								Desativar cliente
							</button>
						) : (
							<button
								type="button"
								onClick={() =>
									activateMutation.mutate(undefined, {
										onSuccess: () => onOpenChange(false),
									})
								}
								disabled={activateMutation.isPending}
								className="h-[50px] rounded-[10px] border border-sage-500 font-bold text-[15px] text-sage-500 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{activateMutation.isPending
									? "Reativando..."
									: "Reativar cliente"}
							</button>
						)}
					</>
				}
			>
				<form
					id="edit-customer-form"
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
					noValidate
				>
					<TextField
						id="name"
						label="Nome"
						placeholder="Nome completo"
						error={errors.name?.message}
						register={register("name")}
					/>
					<ReadOnlyField id="email" label="E-mail" value={customer.email} />
					<ReadOnlyField id="cpf" label="CPF" value={customer.cpf} />
					<TextField
						id="phone"
						label="Telefone"
						placeholder="(38) 99123-0000"
						error={errors.phone?.message}
						register={registerWithMask(
							"phone",
							["(99) 9999-9999", "(99) 99999-9999"],
							{ autoUnmask: true },
						)}
					/>
					<TextField
						id="emergencyContactName"
						label="Contato de emergência"
						placeholder="Nome do contato"
						error={errors.emergencyContactName?.message}
						register={register("emergencyContactName")}
					/>
					<TextField
						id="emergencyContactPhone"
						label="Telefone de emergência"
						placeholder="(38) 99123-0000"
						error={errors.emergencyContactPhone?.message}
						register={registerWithMask(
							"emergencyContactPhone",
							["(99) 9999-9999", "(99) 99999-9999"],
							{ autoUnmask: true },
						)}
					/>
					{errors.root && (
						<div className="rounded-[10px] bg-[#F1E6CC] px-3.5 py-2.5 text-center text-[13px] font-medium text-[#9C4A3E]">
							{errors.root.message}
						</div>
					)}
				</form>
			</FormPanel>

			<ConfirmDialog
				open={confirmingDeactivate}
				onOpenChange={setConfirmingDeactivate}
				title="Desativar cliente"
				description={`Tem certeza que deseja desativar o acesso de ${customer.name}? O cadastro não será excluído.`}
				confirmLabel="Desativar"
				variant="destructive"
				isConfirming={deactivateMutation.isPending}
				onConfirm={() => {
					deactivateMutation.mutate(undefined, {
						onSuccess: () => {
							setConfirmingDeactivate(false);
							onOpenChange(false);
						},
					});
				}}
			/>
		</>
	);
}

function TextField({
	id,
	label,
	type = "text",
	placeholder,
	error,
	register,
}: {
	id: string;
	label: string;
	type?: string;
	placeholder?: string;
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
				type={type}
				placeholder={placeholder}
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

function ReadOnlyField({
	id,
	label,
	value,
}: {
	id: string;
	label: string;
	value: string;
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
				value={value}
				disabled
				className="h-[50px] w-full cursor-not-allowed rounded-[10px] border-[1.5px] border-neutral-300 bg-cream-100 px-4 font-medium text-[14.5px] text-neutral-600 outline-none"
			/>
		</div>
	);
}
