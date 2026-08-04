import { authClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

import { ApiResponse } from "@/types/api";

import {
  BusinessCategory,
  BusinessType,
  Industry,
  IndustryCategory,
} from "@/types/lookup";

export const lookupService = {
  /**
   * ---------------------------------------------------------------------------
   * Business Categories
   * ---------------------------------------------------------------------------
   */
  async getBusinessCategories() {
    const { data } = await authClient.get<ApiResponse<BusinessCategory[]>>(
      API_ENDPOINTS.lookup.businessCategories
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Business Types
   * ---------------------------------------------------------------------------
   */
  async getBusinessTypes() {
    const { data } = await authClient.get<ApiResponse<BusinessType[]>>(
      API_ENDPOINTS.lookup.businessTypes
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Industries
   * ---------------------------------------------------------------------------
   */
  async getIndustries() {
    const { data } = await authClient.get<ApiResponse<Industry[]>>(
      API_ENDPOINTS.lookup.industries
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Industry Categories
   * ---------------------------------------------------------------------------
   */
  async getIndustryCategories(industryId: number) {
    const { data } = await authClient.get<ApiResponse<IndustryCategory[]>>(
      API_ENDPOINTS.lookup.industryCategories(industryId)
    );

    return data;
  },
};
