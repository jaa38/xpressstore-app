import { authClient } from "@/api/client";

import { API_ENDPOINTS } from "@/api/endpoints";

import { ApiResponse } from "@/types/api";

import {
  MerchantProfile,
  UpdateBusinessDetailsRequest,
  UpdateBusinessTypeRequest,
} from "@/types/merchant";

export const merchantService = {
  /**
   * Merchant Profile
   */
  async getProfile() {
    const { data } =
      await authClient.get<
        ApiResponse<MerchantProfile>
      >(API_ENDPOINTS.profile.me);

    return data;
  },

  /**
   * Update Business Details
   */
  async updateBusinessDetails(
    payload: UpdateBusinessDetailsRequest
  ) {
    const { data } =
      await authClient.post<ApiResponse<void>>(
        API_ENDPOINTS.auth
          .updateBusinessDetails,
        payload
      );

    return data;
  },

  /**
   * Update Business Type
   */
  async updateBusinessType(
    payload: UpdateBusinessTypeRequest
  ) {
    const { data } =
      await authClient.post<ApiResponse<void>>(
        API_ENDPOINTS.auth
          .updateBusinessType,
        payload
      );

    return data;
  },
};