import { authClient } from "@/api/client";

import { API_ENDPOINTS } from "@/api/endpoints";

import { ApiResponse } from "@/types/api";

import {
  UpdateBusinessDetailsRequest,
  UpdateBusinessTypeRequest,
} from "@/types/merchant";

export const merchantService = {
  /**
   * ---------------------------------------------------------------------------
   * Update Business Details
   * ---------------------------------------------------------------------------
   */
  async updateBusinessDetails(payload: UpdateBusinessDetailsRequest) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.auth.updateBusinessDetails,
      payload
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Update Business Type
   * ---------------------------------------------------------------------------
   */
  async updateBusinessType(payload: UpdateBusinessTypeRequest) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.auth.updateBusinessType,
      payload
    );

    return data;
  },
};
