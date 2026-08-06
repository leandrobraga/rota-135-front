import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { translateAuthError } from "#/features/auth/lib/auth-error-messages";
import {
	type LoginInput,
	loginSchema,
} from "#/features/auth/schemas/login-schema";
import { authClient } from "#/lib/auth-client";

const loginSearchSchema = z.object({
	redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
	validateSearch: loginSearchSchema,
	component: LoginPage,
});

function LoginPage() {
	const router = useRouter();
	const search = Route.useSearch();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		mode: "onChange",
	});

	async function onSubmit(values: LoginInput) {
		await authClient.signIn.email(values, {
			onSuccess: () => {
				router.navigate({ to: search.redirect ?? "/" });
			},
			onError: ({ error }) => {
				setError("root", { message: translateAuthError(error.code) });
			},
		});
	}

	return (
		<div className="flex min-h-screen">
			<div className="flex flex-1 flex-col items-center justify-center bg-[linear-gradient(160deg,#0F1F3A_0%,#0A1628_100%)] px-15 py-15">
				<div className="mb-6 h-[1.5px] w-14 bg-gold-500" />
				<div className="font-display text-[42px] font-bold tracking-[2px] text-white">
					ROTA 135
				</div>
				<div className="mt-3 text-[14px] leading-none font-bold tracking-[3px] text-gold-500">
					PAINEL ADMINISTRATIVO
				</div>
				<div className="mt-6 mb-7 h-[1.5px] w-14 bg-gold-500" />
				<div className="max-w-[340px] text-center text-[14.5px] leading-[1.7] text-white/55">
					Gestão de agendamentos, frota, cadastros e financeiro da rota Montes
					Claros – Belo Horizonte.
				</div>
			</div>

			<div className="flex w-[460px] flex-none flex-col justify-center bg-white px-15 py-15">
				<div className="mb-1.5 text-[26px] font-bold text-navy-800">Entrar</div>
				<div className="mb-7 text-[14px] leading-none text-neutral-600">
					Acesse com sua conta corporativa.
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
					noValidate
				>
					<div>
						<label
							htmlFor="email"
							className="mb-1.5 block text-[12px] leading-none font-bold tracking-[0.3px] text-neutral-600"
						>
							E-MAIL
						</label>
						<input
							id="email"
							type="email"
							autoComplete="email"
							placeholder="voce@rota135.com.br"
							className="h-[50px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500"
							{...register("email")}
						/>
						{errors.email && (
							<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
								{errors.email.message}
							</span>
						)}
					</div>

					<div>
						<label
							htmlFor="password"
							className="mb-1.5 block text-[12px] leading-none font-bold tracking-[0.3px] text-neutral-600"
						>
							SENHA
						</label>
						<input
							id="password"
							type="password"
							autoComplete="current-password"
							placeholder="••••••••"
							className="h-[50px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500"
							{...register("password")}
						/>
						{errors.password && (
							<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
								{errors.password.message}
							</span>
						)}
					</div>

					{errors.root && (
						<div className="rounded-[10px] bg-[#F1E6CC] px-3.5 py-2.5 text-center text-[13px] font-medium text-[#9C4A3E]">
							{errors.root.message}
						</div>
					)}

					<button
						type="submit"
						disabled={isSubmitting}
						className={`mt-1.5 h-[50px] rounded-[10px] text-[15px] leading-none font-bold transition-colors ${
							isSubmitting
								? "cursor-not-allowed bg-[#E8E3D8] text-[#A9A196]"
								: "cursor-pointer bg-gold-500 text-navy-800"
						}`}
					>
						{isSubmitting ? "Entrando..." : "Entrar no painel"}
					</button>
					<div className="mt-1.5 text-center text-[12.5px] text-neutral-500">
						Acesso por convite · Admin, Operador ou Financeiro
					</div>
				</form>
			</div>
		</div>
	);
}
