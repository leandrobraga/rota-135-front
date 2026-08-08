import { useMutation, useQueryClient } from "@tanstack/react-query";

import { usersQueryKeys } from "#/features/users/queries/use-users-query";
import { UsersService } from "#/features/users/services/users.service";
import { toast } from "#/lib/toast";

export function useDeactivateUserMutation(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => UsersService.deactivate(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });
			toast.success("Usuário desativado");
		},
	});
}
