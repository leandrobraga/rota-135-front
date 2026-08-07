import type {
  CreateDriverInput,
  Driver,
  DriverApprovalStatus,
  DriversListResponse,
  ListDriversParams,
  UpdateDriverInput,
} from "#/features/drivers/types";
import { typedApi } from "#/lib/api-client/typed-client";

export const DriversService = {
  list: async (
    params: ListDriversParams = {},
  ): Promise<DriversListResponse> => {
    const { data } = await typedApi.get("/drivers/", {
      params: { query: params },
    });
    return data;
  },

  getById: async (id: string): Promise<Driver> => {
    const { data } = await typedApi.get("/drivers/{id}", {
      params: { path: { id } },
    });
    return data as Driver;
  },

  create: async (body: CreateDriverInput): Promise<Driver> => {
    const { data } = await typedApi.post("/drivers/", { json: body });
    return data as Driver;
  },

  update: async (id: string, body: UpdateDriverInput): Promise<Driver> => {
    const { data } = await typedApi.patch("/drivers/{id}", {
      params: { path: { id } },
      json: body,
    });
    return data as Driver;
  },

  updateApprovalStatus: async (
    id: string,
    approvalStatus: DriverApprovalStatus,
  ): Promise<Driver> => {
    const { data } = await typedApi.patch("/drivers/{id}/approval-status", {
      params: { path: { id } },
      json: { approvalStatus },
    });
    return data as Driver;
  },

  deactivate: async (id: string): Promise<Driver> => {
    const { data } = await typedApi.patch("/drivers/{id}/deactivate", {
      params: { path: { id } },
    });
    return data as Driver;
  },
};
