import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormRegisterReturn, useForm } from "react-hook-form";
import { FormPanel } from "#/components/FormPanel";
import { translateAuthError } from "#/features/auth/lib/auth-error-messages";
import {
	type ChangePasswordFormData,
	changePasswordSchema,
} from "#/features/auth/schemas/change-password.schema";
import { authClient } from "#/lib/auth-client";

export function ChangePasswordPanel({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<ChangePasswordFormData>({
		resolver: zodResolver(changePasswordSchema),
		mode: "onChange",
	});

	async function onSubmit(values: ChangePasswordFormData) {
		await authClient.changePassword(
			{
				currentPassword: values.currentPassword,
				newPassword: values.newPassword,
				revokeOtherSessions: true,
			},
			{
				onSuccess: () => {
					reset();
					onOpenChange(false);
				},
				onError: ({ error }) => {
					if (error.code === "INVALID_PASSWORD") {
						setError("currentPassword", {
							message: translateAuthError(error.code),
						});
					} else {
						setError("root", { message: translateAuthError(error.code) });
					}
				},
			},
		);
	}

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen) reset();
		onOpenChange(nextOpen);
	}

	return (
		<FormPanel
			open={open}
			onOpenChange={handleOpenChange}
			title="Trocar senha"
			footer={
				<button
					type="submit"
					form="change-password-form"
					disabled={isSubmitting}
					className={`h-[50px] rounded-[10px] font-bold text-[15px] transition-colors ${
						isSubmitting
							? "cursor-not-allowed bg-[#E8E3D8] text-[#A9A196]"
							: "cursor-pointer bg-gold-500 text-navy-800"
					}`}
				>
					{isSubmitting ? "Salvando..." : "Salvar nova senha"}
				</button>
			}
		>
			<form
				id="change-password-form"
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
				noValidate
			>
				<TextField
					id="currentPassword"
					label="Senha atual"
					type="password"
					placeholder="••••••••"
					error={errors.currentPassword?.message}
					register={register("currentPassword")}
				/>
				<TextField
					id="newPassword"
					label="Nova senha"
					type="password"
					placeholder="Mínimo 8 caracteres"
					error={errors.newPassword?.message}
					register={register("newPassword")}
				/>
				<TextField
					id="confirmNewPassword"
					label="Confirmar nova senha"
					type="password"
					placeholder="Repita a nova senha"
					error={errors.confirmNewPassword?.message}
					register={register("confirmNewPassword")}
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
