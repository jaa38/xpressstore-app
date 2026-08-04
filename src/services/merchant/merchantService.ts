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
} from "@/types/merchant";

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
  async updateBusinessDetails(
    payload: UpdateBusinessDetailsRequest
  ) {
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
  async updateBusinessType(
    payload: UpdateBusinessTypeRequest
  ) {
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
    const { data } = await authClient.get<
      ApiResponse<SettlementAccount[]>
    >(API_ENDPOINTS.merchants.settlementAccounts);

    return data;
  },

  async updateSettlementAccount(
    payload: UpdateSettlementAccountRequest
  ) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.merchants.updateSettlementAccount,
      payload
    );

    return data;
  },

  async deleteSettlementAccount(
    settlementAccountId: string
  ) {
    const { data } = await authClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.merchants.deleteSettlementAccount(
        settlementAccountId
      )
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Payment Methods
   * ---------------------------------------------------------------------------
   */
  async getPaymentMethods() {
    const { data } = await authClient.get<
      ApiResponse<PaymentMethod[]>
    >(API_ENDPOINTS.merchants.paymentMethods);

    return data;
  },

  async updatePaymentMethod(
    payload: UpdatePaymentMethodRequest
  ) {
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
  async registerPushNotification(
    payload: RegisterPushNotificationRequest
  ) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.merchants.registerPushNotification,
      payload
    );

    return data;
  },
};