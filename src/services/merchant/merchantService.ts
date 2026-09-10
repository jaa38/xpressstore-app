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
  USE_MOCK_SETTLEMENT_ACCOUNTS,
  updateMockBusinessDetails,
  updateMockBusinessType,
  getMockSettlementAccounts,
  updateMockSettlementAccount,
  deleteMockSettlementAccount,
  validateMockSettlementAccount,
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
/**
 * ---------------------------------------------------------------------------
 * Settlement Accounts
 * ---------------------------------------------------------------------------
 */

  async getSettlementAccounts() {
    if (USE_MOCK_SETTLEMENT_ACCOUNTS) {
      return getMockSettlementAccounts();
    }

    const { data } = await authClient.get<ApiResponse<SettlementAccount[]>>(
      API_ENDPOINTS.merchants.settlementAccounts
    );

    return data;
  },

  async validateSettlementAccount(payload: ValidateSettlementAccountRequest) {
    if (USE_MOCK_SETTLEMENT_ACCOUNTS) {
      return validateMockSettlementAccount(payload);
    }

    const { data } = await authClient.post<
      ApiResponse<ValidateSettlementAccountResponse>
    >(API_ENDPOINTS.merchants.validateSettlementAccount, payload);

    if (!data.data) {
      throw new Error(
        data.responseMessage || "Unable to validate settlement account."
      );
    }

    return data;
  },

  async updateSettlementAccount(payload: UpdateSettlementAccountRequest) {
    if (USE_MOCK_SETTLEMENT_ACCOUNTS) {
      return updateMockSettlementAccount(payload);
    }

    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.merchants.updateSettlementAccount,
      payload
    );

    return data;
  },

  async deleteSettlementAccount(settlementId: string | number) {
    if (USE_MOCK_SETTLEMENT_ACCOUNTS) {
      return deleteMockSettlementAccount(settlementId);
    }

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
