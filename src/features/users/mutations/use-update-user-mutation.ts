import { useMutation, useQueryClient } from "@tanstack/react-query";

import { usersQueryKeys } from "#/features/users/queries/use-users-query";
import { UsersService } from "#/features/users/services/users.service";
import type { UpdateUserInput } from "#/features/users/types";

export function useUpdateUserMutation(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateUserInput) => UsersService.update(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });
		},
	});
}
