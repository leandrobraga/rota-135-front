import type { operations } from "#/lib/api-client/schema.d.ts";
import type { ApiResponse } from "#/lib/api-client/typed-client";

type RawUser = ApiResponse<"getUsersById">;

export type UserRole = "ADMIN" | "OPERATOR" | "FINANCE";

// createdAt/updatedAt vêm unknown do gerador (z.date() não representável em
// JSON Schema) — sabemos que o valor real de fio é string ISO. role vem
// tipado no schema como união com DRIVER/CUSTOMER (mesmo enum do banco),
// mas essa rota só lista contas de equipe — sempre ADMIN/OPERATOR/FINANCE.
export type User = Omit<RawUser, "createdAt" | "updatedAt" | "role"> & {
	createdAt: string;
	updatedAt: string;
	role: UserRole;
};

export type UsersListResponse = ApiResponse<"getUsers">;

export type CreateUserInput =
	operations["postUsers"]["requestBody"]["content"]["application/json"];

export type CreateUserResponse = ApiResponse<"postUsers">;

export type UpdateUserInput =
	operations["patchUsersById"]["requestBody"]["content"]["application/json"];

export type ResetPasswordResponse = ApiResponse<"patchUsersByIdPassword">;
