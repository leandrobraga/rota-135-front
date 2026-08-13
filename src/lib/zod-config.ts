import { z } from "zod";

z.config({
	customError: (issue) => {
		if (issue.code === "invalid_type") return "Campo obrigatório";
		if (issue.code === "too_small") return "Valor muito pequeno";
		if (issue.code === "too_big") return "Valor muito grande";
		if (issue.code === "invalid_format") return "Formato inválido";
		return undefined;
	},
});
