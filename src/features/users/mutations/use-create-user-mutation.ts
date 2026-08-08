import { useMutation, useQueryClient } from "@tanstack/react-query";

import { usersQueryKeys } from "#/features/users/queries/use-users-query";
import { UsersService } from "#/features/users/services/users.service";
import type { CreateUserInput } from "#/features/users/types";

export function useCreateUserMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreateUserInput) => UsersService.create(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });
		},
	});
}
