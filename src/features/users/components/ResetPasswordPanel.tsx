import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { type UseFormRegisterReturn, useForm } from "react-hook-form";
import { FormPanel } from "#/components/FormPanel";
import { useResetUserPasswordMutation } from "#/features/users/mutations/use-reset-user-password-mutation";
import {
	type ResetPasswordFormData,
	resetPasswordSchema,
} from "#/features/users/schemas/reset-password.schema";
import type { User } from "#/features/users/types";
import { getApiFieldError } from "#/lib/api-error";

const RESET_PASSWORD_FORM_FIELDS = ["newPassword", "confirmPassword"] as const;
type ResetPasswordFormField = (typeof RESET_PASSWORD_FORM_FIELDS)[number];

function isResetPasswordFormField(
	field: string | undefined,
): field is ResetPasswordFormField {
	return (RESET_PASSWORD_FORM_FIELDS as readonly string[]).includes(
		field ?? "",
	);
}

export function ResetPasswordPanel({
	user,
	open,
	onOpenChange,
}: {
	user: User;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const resetPasswordMutation = useResetUserPasswordMutation(user.id);
	const [emailWarning, setEmailWarning] = useState(false);
	const [passwordReset, setPasswordReset] = useState(false);
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		mode: "onChange",
	});

	async function onSubmit(values: ResetPasswordFormData) {
		try {
			const result = await resetPasswordMutation.mutateAsync(
				values.newPassword,
			);
			if (result.emailSent === false) {
				setEmailWarning(true);
				setPasswordReset(true);
				return;
			}
			reset();
			onOpenChange(false);
		} catch (error) {
			const { field, message } = getApiFieldError(error);
			if (isResetPasswordFormField(field)) {
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
			setPasswordReset(false);
		}
		onOpenChange(nextOpen);
	}

	return (
		<FormPanel
			open={open}
			onOpenChange={handleOpenChange}
			title={`Redefinir senha — ${user.name}`}
			footer={
				passwordReset ? (
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
						form="reset-password-form"
						disabled={isSubmitting}
						className={`h-[50px] rounded-[10px] font-bold text-[15px] transition-colors ${
							isSubmitting
								? "cursor-not-allowed bg-[#E8E3D8] text-[#A9A196]"
								: "cursor-pointer bg-gold-500 text-navy-800"
						}`}
					>
						{isSubmitting ? "Salvando..." : "Redefinir senha"}
					</button>
				)
			}
		>
			<form
				id="reset-password-form"
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
				noValidate
			>
				<TextField
					id="newPassword"
					label="Nova senha"
					type="password"
					placeholder="Mínimo 8 caracteres"
					error={errors.newPassword?.message}
					register={register("newPassword")}
					disabled={passwordReset}
				/>
				<TextField
					id="confirmPassword"
					label="Confirmar senha"
					type="password"
					placeholder="Repita a senha"
					error={errors.confirmPassword?.message}
					register={register("confirmPassword")}
					disabled={passwordReset}
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
								A senha foi redefinida, mas não foi possível avisar o usuário
								por e-mail. Repasse a nova senha manualmente.
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
