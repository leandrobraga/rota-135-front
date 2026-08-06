import { isHTTPError } from "ky";

const FALLBACK_MESSAGE = "Não foi possível salvar. Tente novamente.";

type BusinessErrorBody = {
	error?: {
		code?: string;
		message?: string;
	};
};

type ValidationErrorBody = {
	type?: string;
	errors?: {
		path?: string[];
		message?: string;
	}[];
};

export function getApiErrorMessage(error: unknown): string {
	return getApiFieldError(error).message;
}

// Elysia/Zod devolve { type: "validation", errors: [{ path, message }] };
// nosso contrato de erro de negócio devolve { error: { code, message } }.
// Formato de validação carrega field pra apontar erro embaixo do input certo.
export function getApiFieldError(error: unknown): {
	field?: string;
	message: string;
} {
	if (!isHTTPError(error)) return { message: FALLBACK_MESSAGE };

	const data = error.data;
	if (typeof data !== "object" || data === null)
		return { message: FALLBACK_MESSAGE };

	const validation = data as ValidationErrorBody;
	if (validation.type === "validation" && Array.isArray(validation.errors)) {
		const first = validation.errors[0];
		if (first?.message) {
			return first.path?.[0]
				? { field: first.path[0], message: first.message }
				: { message: first.message };
		}
	}

	const business = data as BusinessErrorBody;
	if (business.error?.message) return { message: business.error.message };

	return { message: FALLBACK_MESSAGE };
}
