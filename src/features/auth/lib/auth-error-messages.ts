const messages: Record<string, string> = {
	INVALID_EMAIL_OR_PASSWORD: "E-mail ou senha inválidos.",
};

const FALLBACK_MESSAGE = "Não foi possível entrar. Tente novamente.";

export function translateAuthError(code: string | undefined) {
	if (!code) return FALLBACK_MESSAGE;
	return messages[code] ?? FALLBACK_MESSAGE;
}
