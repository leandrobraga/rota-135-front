import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type UseFormRegisterReturn, useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import { ConfirmDialog } from "#/components/ConfirmDialog";
import { FormPanel } from "#/components/FormPanel";
import { DriverStatusBadge } from "#/features/drivers/components/DriverStatusBadge";
import { useActivateDriverMutation } from "#/features/drivers/mutations/use-activate-driver-mutation";
import { useCreateDriverMutation } from "#/features/drivers/mutations/use-create-driver-mutation";
import { useDeactivateDriverMutation } from "#/features/drivers/mutations/use-deactivate-driver-mutation";
import { useUpdateApprovalStatusMutation } from "#/features/drivers/mutations/use-update-approval-status-mutation";
import { useUpdateDriverMutation } from "#/features/drivers/mutations/use-update-driver-mutation";
import {
	type CreateDriverFormData,
	createDriverSchema,
} from "#/features/drivers/schemas/create-driver.schema";
import {
	type UpdateDriverFormData,
	updateDriverSchema,
} from "#/features/drivers/schemas/update-driver.schema";
import type { Driver, DriverApprovalStatus } from "#/features/drivers/types";
import { getApiFieldError } from "#/lib/api-error";

const APPROVAL_STATUS_OPTIONS: {
	value: DriverApprovalStatus;
	label: string;
	style: string;
	needsConfirm: boolean;
}[] = [
	{
		value: "PENDING",
		label: "Pendente",
		style: "border border-neutral-300 text-navy-800",
		needsConfirm: true,
	},
	{
		value: "APPROVED",
		label: "Aprovado",
		style: "border border-sage-500 text-sage-500",
		needsConfirm: false,
	},
	{
		value: "REJECTED",
		label: "Rejeitado",
		style: "border border-[#9C4A3E] text-[#9C4A3E]",
		needsConfirm: true,
	},
	{
		value: "SUSPENDED",
		label: "Suspenso",
		style: "border border-[#9C4A3E] text-[#9C4A3E]",
		needsConfirm: true,
	},
];

const APPROVAL_STATUS_CONFIRM_COPY: Record<
	DriverApprovalStatus,
	{ title: string; description: (name: string) => string; confirmLabel: string }
> = {
	PENDING: {
		title: "Voltar para pendente",
		description: (name) =>
			`Tem certeza que deseja voltar o status de ${name} para pendente?`,
		confirmLabel: "Voltar para pendente",
	},
	APPROVED: {
		title: "Aprovar motorista",
		description: (name) => `Tem certeza que deseja aprovar ${name}?`,
		confirmLabel: "Aprovar",
	},
	REJECTED: {
		title: "Rejeitar motorista",
		description: (name) => `Tem certeza que deseja rejeitar ${name}?`,
		confirmLabel: "Rejeitar",
	},
	SUSPENDED: {
		title: "Suspender motorista",
		description: (name) => `Tem certeza que deseja suspender ${name}?`,
		confirmLabel: "Suspender",
	},
};

const CREATE_DRIVER_FORM_FIELDS = [
	"name",
	"email",
	"phone",
	"cpf",
	"licenseNumber",
	"pixKey",
] as const;
type CreateDriverFormField = (typeof CREATE_DRIVER_FORM_FIELDS)[number];

// email/cpf não são editáveis nessa rota, então não existem como campo do form de edição.
const UPDATE_DRIVER_FORM_FIELDS = [
	"name",
	"phone",
	"licenseNumber",
	"pixKey",
] as const;
type UpdateDriverFormField = (typeof UPDATE_DRIVER_FORM_FIELDS)[number];

function isCreateDriverFormField(
	field: string | undefined,
): field is CreateDriverFormField {
	return (CREATE_DRIVER_FORM_FIELDS as readonly string[]).includes(field ?? "");
}

function isUpdateDriverFormField(
	field: string | undefined,
): field is UpdateDriverFormField {
	return (UPDATE_DRIVER_FORM_FIELDS as readonly string[]).includes(field ?? "");
}

type Props =
	| {
			mode: "create";
			driver?: undefined;
			open: boolean;
			onOpenChange: (open: boolean) => void;
	  }
	| {
			mode: "edit";
			driver: Driver;
			open: boolean;
			onOpenChange: (open: boolean) => void;
	  };

export function DriverFormPanel(props: Props) {
	return props.mode === "create" ? (
		<CreateDriverForm open={props.open} onOpenChange={props.onOpenChange} />
	) : (
		<EditDriverForm
			driver={props.driver}
			open={props.open}
			onOpenChange={props.onOpenChange}
		/>
	);
}

function CreateDriverForm({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const createMutation = useCreateDriverMutation();
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<CreateDriverFormData>({
		resolver: zodResolver(createDriverSchema),
		mode: "onChange",
	});
	const registerWithMask = useHookFormMask(register);

	async function onSubmit(values: CreateDriverFormData) {
		try {
			await createMutation.mutateAsync(values);
			reset();
			onOpenChange(false);
		} catch (error) {
			const { field, message } = getApiFieldError(error);
			if (isCreateDriverFormField(field)) {
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
		<FormPanel
			open={open}
			onOpenChange={handleOpenChange}
			title="Novo motorista"
			footer={
				<button
					type="submit"
					form="create-driver-form"
					disabled={isSubmitting}
					className={`h-[50px] rounded-[10px] font-bold text-[15px] transition-colors ${
						isSubmitting
							? "cursor-not-allowed bg-[#E8E3D8] text-[#A9A196]"
							: "cursor-pointer bg-gold-500 text-navy-800"
					}`}
				>
					{isSubmitting ? "Salvando..." : "Cadastrar motorista"}
				</button>
			}
		>
			<form
				id="create-driver-form"
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
				<TextField
					id="email"
					label="E-mail"
					type="email"
					placeholder="motorista@rota135.com.br"
					error={errors.email?.message}
					register={register("email")}
				/>
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
					id="cpf"
					label="CPF"
					placeholder="000.000.000-00"
					error={errors.cpf?.message}
					register={registerWithMask("cpf", "cpf", { autoUnmask: true })}
				/>
				<TextField
					id="licenseNumber"
					label="CNH"
					placeholder="Número da habilitação"
					error={errors.licenseNumber?.message}
					register={register("licenseNumber")}
				/>
				<TextField
					id="pixKey"
					label="Chave PIX"
					placeholder="Opcional"
					error={errors.pixKey?.message}
					register={register("pixKey")}
				/>
				{errors.root && (
					<div className="rounded-[10px] bg-[#F1E6CC] px-3.5 py-2.5 text-center text-[13px] font-medium text-[#9C4A3E]">
						{errors.root.message}
					</div>
				)}
			</form>
		</FormPanel>
	);
}

function EditDriverForm({
	driver,
	open,
	onOpenChange,
}: {
	driver: Driver;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [confirmingDeactivate, setConfirmingDeactivate] = useState(false);
	const [confirmingApprovalStatus, setConfirmingApprovalStatus] =
		useState<DriverApprovalStatus | null>(null);
	const updateMutation = useUpdateDriverMutation(driver.id);
	const deactivateMutation = useDeactivateDriverMutation(driver.id);
	const activateMutation = useActivateDriverMutation(driver.id);
	const approvalStatusMutation = useUpdateApprovalStatusMutation(driver.id);
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<UpdateDriverFormData>({
		resolver: zodResolver(updateDriverSchema),
		mode: "onChange",
		defaultValues: {
			name: driver.name,
			phone: driver.phone ?? "",
			licenseNumber: driver.licenseNumber,
			pixKey: driver.pixKey ?? "",
		},
	});
	const registerWithMask = useHookFormMask(register);

	async function onSubmit(values: UpdateDriverFormData) {
		try {
			await updateMutation.mutateAsync(values);
			onOpenChange(false);
		} catch (error) {
			const { field, message } = getApiFieldError(error);
			if (isUpdateDriverFormField(field)) {
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
				title="Editar motorista"
				footer={
					<>
						<button
							type="submit"
							form="edit-driver-form"
							disabled={isSubmitting}
							className={`h-[50px] rounded-[10px] font-bold text-[15px] transition-colors ${
								isSubmitting
									? "cursor-not-allowed bg-[#E8E3D8] text-[#A9A196]"
									: "cursor-pointer bg-gold-500 text-navy-800"
							}`}
						>
							{isSubmitting ? "Salvando..." : "Salvar alterações"}
						</button>
						{driver.active ? (
							<button
								type="button"
								onClick={() => setConfirmingDeactivate(true)}
								className="h-[50px] rounded-[10px] border border-[#9C4A3E] font-bold text-[15px] text-[#9C4A3E]"
							>
								Desativar motorista
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
									: "Reativar motorista"}
							</button>
						)}
					</>
				}
			>
				<form
					id="edit-driver-form"
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
					<ReadOnlyField id="email" label="E-mail" value={driver.email} />
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
					<ReadOnlyField id="cpf" label="CPF" value={driver.cpf} />
					<TextField
						id="licenseNumber"
						label="CNH"
						placeholder="Número da habilitação"
						error={errors.licenseNumber?.message}
						register={register("licenseNumber")}
					/>
					<TextField
						id="pixKey"
						label="Chave PIX"
						placeholder="Opcional"
						error={errors.pixKey?.message}
						register={register("pixKey")}
					/>
					{errors.root && (
						<div className="rounded-[10px] bg-[#F1E6CC] px-3.5 py-2.5 text-center text-[13px] font-medium text-[#9C4A3E]">
							{errors.root.message}
						</div>
					)}
				</form>
			</FormPanel>

			<div className="mt-4 rounded-[10px] border border-neutral-300 p-4">
				<div className="mb-3 flex items-center justify-between">
					<span className="text-[12px] font-bold tracking-[0.3px] text-neutral-600">
						STATUS DE APROVAÇÃO
					</span>
					<DriverStatusBadge
						active={driver.active}
						approvalStatus={driver.approvalStatus}
					/>
				</div>
				<div className="flex flex-wrap gap-2">
					{APPROVAL_STATUS_OPTIONS.map((option) => {
						const isCurrent = driver.approvalStatus === option.value;
						return (
							<button
								key={option.value}
								type="button"
								disabled={isCurrent || approvalStatusMutation.isPending}
								onClick={() => {
									if (option.needsConfirm) {
										setConfirmingApprovalStatus(option.value);
									} else {
										approvalStatusMutation.mutate(option.value);
									}
								}}
								className={`h-9 rounded-[10px] px-3 font-bold text-[13px] disabled:cursor-not-allowed disabled:opacity-50 ${option.style}`}
							>
								{option.label}
							</button>
						);
					})}
				</div>
			</div>

			<ConfirmDialog
				open={confirmingDeactivate}
				onOpenChange={setConfirmingDeactivate}
				title="Desativar motorista"
				description={`Tem certeza que deseja desativar o acesso de ${driver.name}? O cadastro não será excluído.`}
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

			<ConfirmDialog
				open={confirmingApprovalStatus !== null}
				onOpenChange={(open) => !open && setConfirmingApprovalStatus(null)}
				title={
					confirmingApprovalStatus
						? APPROVAL_STATUS_CONFIRM_COPY[confirmingApprovalStatus].title
						: ""
				}
				description={
					confirmingApprovalStatus
						? APPROVAL_STATUS_CONFIRM_COPY[
								confirmingApprovalStatus
							].description(driver.name)
						: ""
				}
				confirmLabel={
					confirmingApprovalStatus
						? APPROVAL_STATUS_CONFIRM_COPY[confirmingApprovalStatus]
								.confirmLabel
						: ""
				}
				variant="destructive"
				isConfirming={approvalStatusMutation.isPending}
				onConfirm={() => {
					if (!confirmingApprovalStatus) return;
					approvalStatusMutation.mutate(confirmingApprovalStatus, {
						onSuccess: () => setConfirmingApprovalStatus(null),
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
