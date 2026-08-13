import type { operations } from "#/lib/api-client/schema.d.ts";
import type { ApiResponse } from "#/lib/api-client/typed-client";

type RawCustomer = ApiResponse<"getCustomerById">;

// createdAt/updatedAt vêm unknown do gerador (z.date() não representável em
// JSON Schema) — sabemos que o valor real de fio é string ISO.
export type Customer = Omit<RawCustomer, "createdAt" | "updatedAt"> & {
	createdAt: string;
	updatedAt: string;
};

export type CustomerListResponse = ApiResponse<"getCustomer">;

// Shape de referência pro schema Zod de input — não precisa ser idêntico,
// só consistente com o que o backend espera no body. Sem create: Customer só
// nasce via hook de sign-up do Better Auth.
export type UpdateCustomerInput =
	operations["patchCustomerById"]["requestBody"]["content"]["application/json"];

export type ListCustomerParams = NonNullable<
	operations["getCustomer"]["parameters"]["query"]
>;

type RawCustomerCredit = ApiResponse<"getCustomerByIdCredits">[number];

// createdAt vem unknown do gerador (Date não representável em JSON Schema)
// — sabemos que o valor real de fio é string ISO. amount é Decimal no
// backend, chega como string.
export type CustomerCredit = Omit<RawCustomerCredit, "createdAt" | "amount"> & {
	createdAt: string;
	amount: string;
};

export type GrantCreditInput =
	operations["postCustomerByIdCredits"]["requestBody"]["content"]["application/json"];
