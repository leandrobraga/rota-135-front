import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
	});

	async function onSubmit(values: LoginInput) {
		await authClient.signIn.email(values, {
			onSuccess: () => {
				router.navigate({ to: search.redirect ?? "/" });
			},
			onError: ({ error }) => {
				setError("root", {
					message: error.message ?? "Não foi possível entrar. Tente novamente.",
				});
			},
		});
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-cream-100 px-4">
			<div className="w-full max-w-md rounded-2xl bg-cream-50 p-10 shadow-sm">
				<h1 className="font-display text-3xl font-bold text-navy-900">
					Rota 135
				</h1>
				<p className="mt-1 text-sm text-neutral-600">
					Entre com sua conta para continuar.
				</p>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="mt-8 flex flex-col gap-4"
					noValidate
				>
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="email"
							className="text-sm font-medium text-navy-900"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							autoComplete="email"
							className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500"
							{...register("email")}
						/>
						{errors.email && (
							<span className="text-sm text-red-600">
								{errors.email.message}
							</span>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="password"
							className="text-sm font-medium text-navy-900"
						>
							Senha
						</label>
						<input
							id="password"
							type="password"
							autoComplete="current-password"
							className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500"
							{...register("password")}
						/>
						{errors.password && (
							<span className="text-sm text-red-600">
								{errors.password.message}
							</span>
						)}
					</div>

					{errors.root && (
						<span className="text-sm text-red-600">{errors.root.message}</span>
					)}

					<button
						type="submit"
						disabled={isSubmitting}
						className="mt-2 rounded-full bg-navy-900 py-2.5 text-sm font-medium text-cream-100 transition-colors hover:bg-navy-800 disabled:opacity-60"
					>
						{isSubmitting ? "Entrando..." : "Entrar"}
					</button>
				</form>
			</div>
		</div>
	);
}
