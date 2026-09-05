import { authClient } from "@/api/client";

import { API_ENDPOINTS } from "@/api/endpoints";

import { ApiResponse } from "@/types/api";

import {
  MerchantProfile,
  PaymentMethod,
  RegisterPushNotificationRequest,
  SettlementAccount,
  UpdateBusinessDetailsRequest,
  UpdateBusinessTypeRequest,
  UpdatePaymentMethodRequest,
  UpdateSettlementAccountRequest,
  ValidateSettlementAccountRequest,
  ValidateSettlementAccountResponse,
} from "@/types/merchant";

import {
  USE_MOCK_ONBOARDING,
  updateMockBusinessDetails,
  updateMockBusinessType,
} from "@/mocks";

export const merchantService = {
  /**
   * ---------------------------------------------------------------------------
   * Merchant Profile
   * ---------------------------------------------------------------------------
   */
  async getProfile() {
    const { data } = await authClient.get<ApiResponse<MerchantProfile>>(
      API_ENDPOINTS.auth.fetchUser
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Update Business Details
   * ---------------------------------------------------------------------------
   */
  async updateBusinessDetails(payload: UpdateBusinessDetailsRequest) {
    if (USE_MOCK_ONBOARDING) {
      updateMockBusinessDetails(payload);

      return {
        responseCode: "00",
        responseMessage: "Business details updated successfully",
        data: undefined,
      };
    }

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
    if (USE_MOCK_ONBOARDING) {
      updateMockBusinessType(payload);

      return {
        responseCode: "00",
        responseMessage: "Business type updated successfully",
        data: undefined,
      };
    }

    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.auth.updateBusinessType,
      payload
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Settlement Accounts
   * ---------------------------------------------------------------------------
   */

  async getSettlementAccounts() {
    const { data } = await authClient.get<ApiResponse<SettlementAccount[]>>(
      API_ENDPOINTS.merchants.settlementAccounts
    );

    return data;
  },

  async validateSettlementAccount(payload: ValidateSettlementAccountRequest) {
    const { data } = await authClient.post<
      ApiResponse<ValidateSettlementAccountResponse>
    >(API_ENDPOINTS.merchants.validateSettlementAccount, payload);

    return data;
  },

  async updateSettlementAccount(payload: UpdateSettlementAccountRequest) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.merchants.updateSettlementAccount,
      payload
    );

    return data;
  },

  async deleteSettlementAccount(settlementId: string | number) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.merchants.deleteSettlementAccount(settlementId)
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Payment Methods
   * ---------------------------------------------------------------------------
   */
  async getPaymentMethods() {
    const { data } = await authClient.get<ApiResponse<PaymentMethod[]>>(
      API_ENDPOINTS.merchants.paymentMethods
    );

    return data;
  },

  async updatePaymentMethod(payload: UpdatePaymentMethodRequest) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.merchants.updatePaymentMethod,
      payload
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Push Notifications
   * ---------------------------------------------------------------------------
   */
  async registerPushNotification(payload: RegisterPushNotificationRequest) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.merchants.registerPushNotification,
      payload
    );

    return data;
  },
};
