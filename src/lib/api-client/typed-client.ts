import type { Options as KyOptions } from "ky";

import { api } from "#/lib/api-client/ky-client";
import type { operations, paths } from "#/lib/api-client/schema.d.ts";

// components.schemas é sempre never nesse projeto — extrai tipo de resposta
// direto da operation, já descendo até o campo `data` do envelope da API.
export type ApiResponse<Op extends keyof operations> =
	operations[Op]["responses"][200]["content"]["application/json"]["data"];

type PathsWithMethod<Method extends string> = {
	[Path in keyof paths]: Method extends keyof paths[Path] ? Path : never;
}[keyof paths];

type OperationOf<
	Path extends keyof paths,
	Method extends string,
> = Method extends keyof paths[Path] ? paths[Path][Method] : never;

type ParamsOf<Operation> = Operation extends { parameters: infer Parameters }
	? Parameters
	: never;

type RequestBodyOf<Operation> = Operation extends {
	requestBody?: { content: { "application/json": infer Body } };
}
	? Body
	: Operation extends {
				requestBody: { content: { "application/json": infer Body } };
			}
		? Body
		: never;

type SuccessResponseOf<Operation> = Operation extends {
	responses: infer Responses;
}
	? Responses extends Record<number, unknown>
		?
				| (200 extends keyof Responses ? ResponseBodyOf<Responses[200]> : never)
				| (201 extends keyof Responses ? ResponseBodyOf<Responses[201]> : never)
				| (204 extends keyof Responses ? ResponseBodyOf<Responses[204]> : never)
		: never
	: never;

type ResponseBodyOf<Response> = Response extends {
	content: { "application/json": infer Body };
}
	? Body
	: never;

type RequestOptions<Operation> = {
	params?: ParamsOf<Operation>;
	json?: RequestBodyOf<Operation>;
} & Omit<KyOptions, "json" | "method">;

async function request<Path extends string, Method extends string, Operation>(
	method: Method,
	path: Path,
	{ params, json, ...kyOptions }: RequestOptions<Operation> = {},
): Promise<SuccessResponseOf<Operation>> {
	const url = resolvePath(path, params);

	return api(url, {
		...kyOptions,
		method,
		json,
	}).json();
}

function resolvePath(path: string, params: unknown): string {
	const pathParams = (
		params as { path?: Record<string, string | number> } | undefined
	)?.path;

	const resolved = pathParams
		? Object.entries(pathParams).reduce(
				(acc, [key, value]) =>
					acc.replace(`{${key}}`, encodeURIComponent(String(value))),
				path,
			)
		: path;

	return resolved.replace(/^\//, "");
}

export const typedApi = {
	get: <Path extends PathsWithMethod<"get">>(
		path: Path,
		options?: RequestOptions<OperationOf<Path, "get">>,
	) => request<Path, "get", OperationOf<Path, "get">>("get", path, options),
	post: <Path extends PathsWithMethod<"post">>(
		path: Path,
		options?: RequestOptions<OperationOf<Path, "post">>,
	) => request<Path, "post", OperationOf<Path, "post">>("post", path, options),
	put: <Path extends PathsWithMethod<"put">>(
		path: Path,
		options?: RequestOptions<OperationOf<Path, "put">>,
	) => request<Path, "put", OperationOf<Path, "put">>("put", path, options),
	patch: <Path extends PathsWithMethod<"patch">>(
		path: Path,
		options?: RequestOptions<OperationOf<Path, "patch">>,
	) =>
		request<Path, "patch", OperationOf<Path, "patch">>("patch", path, options),
	delete: <Path extends PathsWithMethod<"delete">>(
		path: Path,
		options?: RequestOptions<OperationOf<Path, "delete">>,
	) =>
		request<Path, "delete", OperationOf<Path, "delete">>(
			"delete",
			path,
			options,
		),
};
