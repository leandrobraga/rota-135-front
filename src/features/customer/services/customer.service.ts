import type {
	Customer,
	CustomerCredit,
	CustomerListResponse,
	GrantCreditInput,
	ListCustomerParams,
	UpdateCustomerInput,
} from "#/features/customer/types";
import { typedApi } from "#/lib/api-client/typed-client";

export const CustomerService = {
	list: async (
		params: ListCustomerParams = {},
	): Promise<CustomerListResponse> => {
		const { data } = await typedApi.get("/customer/", {
			params: { query: params },
		});
		return data;
	},

	getById: async (id: string): Promise<Customer> => {
		const { data } = await typedApi.get("/customer/{id}", {
			params: { path: { id } },
		});
		return data as Customer;
	},

	update: async (id: string, body: UpdateCustomerInput): Promise<Customer> => {
		const { data } = await typedApi.patch("/customer/{id}", {
			params: { path: { id } },
			json: body,
		});
		return data as Customer;
	},

	deactivate: async (id: string): Promise<Customer> => {
		const { data } = await typedApi.patch("/customer/{id}/deactivate", {
			params: { path: { id } },
		});
		return data as Customer;
	},

	activate: async (id: string): Promise<Customer> => {
		const { data } = await typedApi.patch("/customer/{id}/activate", {
			params: { path: { id } },
		});
		return data as Customer;
	},

	listCredits: async (customerId: string): Promise<CustomerCredit[]> => {
		const { data } = await typedApi.get("/customer/{id}/credits", {
			params: { path: { id: customerId } },
		});
		return data as CustomerCredit[];
	},

	grantCredit: async (
		customerId: string,
		body: GrantCreditInput,
	): Promise<CustomerCredit> => {
		const { data } = await typedApi.post("/customer/{id}/credits", {
			params: { path: { id: customerId } },
			json: body,
		});
		return data as CustomerCredit;
	},

	deleteCredit: async (customerId: string, creditId: string): Promise<void> => {
		await typedApi.delete("/customer/{id}/credits/{creditId}", {
			params: { path: { id: customerId, creditId } },
		});
	},
};
