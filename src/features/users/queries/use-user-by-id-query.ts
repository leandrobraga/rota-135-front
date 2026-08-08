import { useQuery } from "@tanstack/react-query";

import { usersQueryKeys } from "#/features/users/queries/use-users-query";
import { UsersService } from "#/features/users/services/users.service";

export function useUserByIdQuery(id: string) {
	return useQuery({
		queryKey: usersQueryKeys.detail(id),
		queryFn: () => UsersService.getById(id),
		enabled: Boolean(id),
	});
}
