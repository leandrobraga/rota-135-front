import { useMutation, useQueryClient } from "@tanstack/react-query";

import { usersQueryKeys } from "#/features/users/queries/use-users-query";
import { UsersService } from "#/features/users/services/users.service";
import { toast } from "#/lib/toast";

export function useActivateUserMutation(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => UsersService.activate(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });
			toast.success("Usuário reativado");
		},
	});
}
