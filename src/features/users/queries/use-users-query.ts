import { useQuery } from "@tanstack/react-query";

import { UsersService } from "#/features/users/services/users.service";

export const usersQueryKeys = {
	all: ["users"] as const,
	list: () => [...usersQueryKeys.all, "list"] as const,
	detail: (id: string) => [...usersQueryKeys.all, "detail", id] as const,
};

export function useUsersQuery() {
	return useQuery({
		queryKey: usersQueryKeys.list(),
		queryFn: () => UsersService.list(),
	});
}
