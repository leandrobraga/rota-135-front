import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { type UseFormRegisterReturn, useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import type { z } from "zod";
import { ConfirmDialog } from "#/components/ConfirmDialog";
import { FormPanel } from "#/components/FormPanel";
import { useActivateUserMutation } from "#/features/users/mutations/use-activate-user-mutation";
import { useCreateUserMutation } from "#/features/users/mutations/use-create-user-mutation";
import { useDeactivateUserMutation } from "#/features/users/mutations/use-deactivate-user-mutation";
import { useUpdateUserMutation } from "#/features/users/mutations/use-update-user-mutation";
import {
	type CreateUserFormData,
	createUserSchema,
} from "#/features/users/schemas/create-user.schema";
import {
	type UpdateUserFormData,
	updateUserSchema,
} from "#/features/users/schemas/update-user.schema";
import type { User, UserRole } from "#/features/users/types";
import { getApiFieldError } from "#/lib/api-error";
import { formatCpfDisplay } from "#/lib/formatters";

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
	{ value: "ADMIN", label: "Admin" },
	{ value: "OPERATOR", label: "Operador" },
	{ value: "FINANCE", label: "Financeiro" },
];

const CREATE_USER_FORM_FIELDS = [
	"name",
	"email",
	"password",
	"confirmPassword",
	"cpf",
	"role",
] as const;
type CreateUserFormField = (typeof CREATE_USER_FORM_FIELDS)[number];

const UPDATE_USER_FORM_FIELDS = ["name", "role"] as const;
type UpdateUserFormField = (typeof UPDATE_USER_FORM_FIELDS)[number];

function isCreateUserFormField(
	field: string | undefined,
): field is CreateUserFormField {
	return (CREATE_USER_FORM_FIELDS as readonly string[]).includes(field ?? "");
}

function isUpdateUserFormField(
	field: string | undefined,
): field is UpdateUserFormField {
	return (UPDATE_USER_FORM_FIELDS as readonly string[]).includes(field ?? "");
}

type Props =
	| {
			mode: "create";
			user?: undefined;
			open: boolean;
			onOpenChange: (open: boolean) => void;
	  }
	| {
			mode: "edit";
			user: User;
			open: boolean;
			onOpenChange: (open: boolean) => void;
	  };

export function UserFormPanel(props: Props) {
	return props.mode === "create" ? (
		<CreateUserForm open={props.open} onOpenChange={props.onOpenChange} />
	) : (
		<EditUserForm
			user={props.user}
			open={props.open}
			onOpenChange={props.onOpenChange}
		/>
	);
}

function CreateUserForm({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const createMutation = useCreateUserMutation();
	const [emailWarning, setEmailWarning] = useState(false);
	const [accountCreated, setAccountCreated] = useState(false);
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<
		z.input<typeof createUserSchema>,
		// biome-ignore lint/suspicious/noExplicitAny: RHF context generic, unused
		any,
		z.output<typeof createUserSchema>
	>({
		resolver: zodResolver(createUserSchema),
		mode: "onChange",
	});
	const registerWithMask = useHookFormMask(register);

	async function onSubmit(values: CreateUserFormData) {
		try {
			const result = await createMutation.mutateAsync(values);
			if (result.emailSent === false) {
				setEmailWarning(true);
				setAccountCreated(true);
				return;
			}
			reset();
			onOpenChange(false);
		} catch (error) {
			const { field, message } = getApiFieldError(error);
			if (isCreateUserFormField(field)) {
				setError(field, { message });
			} else {
				setError("root", { message });
			}
		}
	}

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen) {
			reset();
			setEmailWarning(false);
			setAccountCreated(false);
		}
		onOpenChange(nextOpen);
	}

	return (
		<FormPanel
			open={open}
			onOpenChange={handleOpenChange}
			title="Novo usuário"
			footer={
				accountCreated ? (
					<button
						type="button"
						onClick={() => handleOpenChange(false)}
						className="h-[50px] cursor-pointer rounded-[10px] bg-gold-500 font-bold text-[15px] text-navy-800"
					>
						Fechar
					</button>
				) : (
					<button
						type="submit"
						form="create-user-form"
						disabled={isSubmitting}
						className={`h-[50px] rounded-[10px] font-bold text-[15px] transition-colors ${
							isSubmitting
								? "cursor-not-allowed bg-[#E8E3D8] text-[#A9A196]"
								: "cursor-pointer bg-gold-500 text-navy-800"
						}`}
					>
						{isSubmitting ? "Salvando..." : "Cadastrar usuário"}
					</button>
				)
			}
		>
			<form
				id="create-user-form"
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
					disabled={accountCreated}
				/>
				<TextField
					id="email"
					label="E-mail"
					type="email"
					placeholder="usuario@rota135.com.br"
					error={errors.email?.message}
					register={register("email")}
					disabled={accountCreated}
				/>
				<TextField
					id="password"
					label="Senha"
					type="password"
					placeholder="Mínimo 8 caracteres"
					error={errors.password?.message}
					register={register("password")}
					disabled={accountCreated}
				/>
				<TextField
					id="confirmPassword"
					label="Confirmar senha"
					type="password"
					placeholder="Repita a senha"
					error={errors.confirmPassword?.message}
					register={register("confirmPassword")}
					disabled={accountCreated}
				/>
				<TextField
					id="cpf"
					label="CPF"
					placeholder="000.000.000-00"
					error={errors.cpf?.message}
					register={registerWithMask("cpf", "cpf", { autoUnmask: true })}
					disabled={accountCreated}
				/>
				<SelectField
					id="role"
					label="Perfil"
					options={ROLE_OPTIONS}
					error={errors.role?.message}
					register={register("role")}
					disabled={accountCreated}
				/>
				{emailWarning && (
					<div className="flex gap-3 rounded-[10px] border-l-4 border-[#9C4A3E] bg-[#F1E6CC] px-4 py-4">
						<TriangleAlert
							size={20}
							strokeWidth={2}
							className="mt-0.5 shrink-0 text-[#9C4A3E]"
						/>
						<div>
							<p className="font-bold text-[14px] text-[#9C4A3E]">
								E-mail não enviado
							</p>
							<p className="mt-0.5 text-[13px] text-[#9C4A3E]">
								A conta foi criada, mas não foi possível enviar a senha por
								e-mail. Repasse manualmente.
							</p>
						</div>
					</div>
				)}
				{errors.root && (
					<div className="rounded-[10px] bg-[#F1E6CC] px-3.5 py-2.5 text-center text-[13px] font-medium text-[#9C4A3E]">
						{errors.root.message}
					</div>
				)}
			</form>
		</FormPanel>
	);
}

function EditUserForm({
	user,
	open,
	onOpenChange,
}: {
	user: User;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [confirmingDeactivate, setConfirmingDeactivate] = useState(false);
	const updateMutation = useUpdateUserMutation(user.id);
	const deactivateMutation = useDeactivateUserMutation(user.id);
	const activateMutation = useActivateUserMutation(user.id);
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<
		z.input<typeof updateUserSchema>,
		// biome-ignore lint/suspicious/noExplicitAny: RHF context generic, unused
		any,
		z.output<typeof updateUserSchema>
	>({
		resolver: zodResolver(updateUserSchema),
		mode: "onChange",
		defaultValues: {
			name: user.name,
			role: user.role,
		},
	});

	async function onSubmit(values: UpdateUserFormData) {
		try {
			await updateMutation.mutateAsync(values);
			onOpenChange(false);
		} catch (error) {
			const { field, message } = getApiFieldError(error);
			if (isUpdateUserFormField(field)) {
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
				title="Editar usuário"
				footer={
					<>
						<button
							type="submit"
							form="edit-user-form"
							disabled={isSubmitting}
							className={`h-[50px] rounded-[10px] font-bold text-[15px] transition-colors ${
								isSubmitting
									? "cursor-not-allowed bg-[#E8E3D8] text-[#A9A196]"
									: "cursor-pointer bg-gold-500 text-navy-800"
							}`}
						>
							{isSubmitting ? "Salvando..." : "Salvar alterações"}
						</button>
						{user.active ? (
							<button
								type="button"
								onClick={() => setConfirmingDeactivate(true)}
								className="h-[50px] rounded-[10px] border border-[#9C4A3E] font-bold text-[15px] text-[#9C4A3E]"
							>
								Desativar usuário
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
									: "Reativar usuário"}
							</button>
						)}
					</>
				}
			>
				<form
					id="edit-user-form"
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
					<ReadOnlyField id="email" label="E-mail" value={user.email} />
					<ReadOnlyField
						id="cpf"
						label="CPF"
						value={formatCpfDisplay(user.cpf)}
					/>
					<SelectField
						id="role"
						label="Perfil"
						options={ROLE_OPTIONS}
						error={errors.role?.message}
						register={register("role")}
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
				title="Desativar usuário"
				description={`Tem certeza que deseja desativar o acesso de ${user.name}? O cadastro não será excluído.`}
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
	disabled,
}: {
	id: string;
	label: string;
	type?: string;
	placeholder?: string;
	error?: string;
	register: UseFormRegisterReturn;
	disabled?: boolean;
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
				disabled={disabled}
				className="h-[50px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500 disabled:cursor-not-allowed disabled:bg-cream-100 disabled:text-neutral-600"
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

function SelectField({
	id,
	label,
	options,
	error,
	register,
	disabled,
}: {
	id: string;
	label: string;
	options: { value: string; label: string }[];
	error?: string;
	register: UseFormRegisterReturn;
	disabled?: boolean;
}) {
	return (
		<div>
			<label
				htmlFor={id}
				className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
			>
				{label.toUpperCase()}
			</label>
			<select
				id={id}
				disabled={disabled}
				className="h-[50px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500 disabled:cursor-not-allowed disabled:bg-cream-100 disabled:text-neutral-600"
				{...register}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
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
