import { useMutation, useQueryClient } from "@tanstack/react-query";

import { usersQueryKeys } from "#/features/users/queries/use-users-query";
import { UsersService } from "#/features/users/services/users.service";

export function useResetUserPasswordMutation(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (newPassword: string) =>
			UsersService.resetPassword(id, newPassword),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });
		},
	});
}
