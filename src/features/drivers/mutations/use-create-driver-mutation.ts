import { useMutation, useQueryClient } from "@tanstack/react-query";

import { driversQueryKeys } from "#/features/drivers/queries/use-drivers-query";
import { DriversService } from "#/features/drivers/services/drivers.service";
import type { CreateDriverInput } from "#/features/drivers/types";
import { toast } from "#/lib/toast";

export function useCreateDriverMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreateDriverInput) => DriversService.create(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: driversQueryKeys.all });
			toast.success("Motorista criado com sucesso");
		},
	});
}
