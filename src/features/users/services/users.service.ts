import type {
	CreateUserInput,
	CreateUserResponse,
	ResetPasswordResponse,
	UpdateUserInput,
	User,
	UsersListResponse,
} from "#/features/users/types";
import { typedApi } from "#/lib/api-client/typed-client";

export const UsersService = {
	list: async (): Promise<UsersListResponse> => {
		const { data } = await typedApi.get("/users/");
		return data;
	},

	getById: async (id: string): Promise<User> => {
		const { data } = await typedApi.get("/users/{id}", {
			params: { path: { id } },
		});
		return data as User;
	},

	create: async (body: CreateUserInput): Promise<CreateUserResponse> => {
		const { data } = await typedApi.post("/users/", { json: body });
		return data;
	},

	update: async (id: string, body: UpdateUserInput): Promise<User> => {
		const { data } = await typedApi.patch("/users/{id}", {
			params: { path: { id } },
			json: body,
		});
		return data as User;
	},

	deactivate: async (id: string): Promise<User> => {
		const { data } = await typedApi.patch("/users/{id}/deactivate", {
			params: { path: { id } },
		});
		return data as User;
	},

	activate: async (id: string): Promise<User> => {
		const { data } = await typedApi.patch("/users/{id}/activate", {
			params: { path: { id } },
		});
		return data as User;
	},

	resetPassword: async (
		id: string,
		newPassword: string,
	): Promise<ResetPasswordResponse> => {
		const { data } = await typedApi.patch("/users/{id}/password", {
			params: { path: { id } },
			json: { newPassword },
		});
		return data;
	},
};
