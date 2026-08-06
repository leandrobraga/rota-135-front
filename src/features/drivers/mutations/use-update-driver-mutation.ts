import { useMutation, useQueryClient } from "@tanstack/react-query";

import { driversQueryKeys } from "#/features/drivers/queries/use-drivers-query";
import { DriversService } from "#/features/drivers/services/drivers.service";
import type { UpdateDriverInput } from "#/features/drivers/types";

export function useUpdateDriverMutation(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateDriverInput) => DriversService.update(id, body),
		onSuccess: () => {
			// invalidateQueries com "all" já cobre "detail" por prefixo, mas fica
			// explícito aqui pra deixar claro que a tela de detalhe também reage.
			queryClient.invalidateQueries({ queryKey: driversQueryKeys.all });
		},
	});
}
