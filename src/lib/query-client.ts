import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Dados de backoffice mudam com pouca frequência e são olhados por
			// poucos operadores por vez: 1 min evita refetch a cada troca de aba
			// sem deixar a tela visivelmente desatualizada.
			staleTime: 60 * 1000,
			// Uma falha costuma ser erro de negócio (4xx) e não instabilidade de
			// rede; poucas retentativas evitam martelar o backend sem necessidade.
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});
