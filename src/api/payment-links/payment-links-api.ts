import { authClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

import type { ApiResponse } from "@/types/api";

import type {
  PaymentLink,
  CreatePaymentLinkRequest,
  UpdatePaymentLinkRequest,
  PaymentLinkTransaction,
} from "@/types/paymentLink";

/**
 * ---------------------------------------------------------------------------
 * Get Payment Links
 * ---------------------------------------------------------------------------
 */
export async function getPaymentLinks() {
  const { data } =
    await authClient.get<ApiResponse<PaymentLink[]>>(
      API_ENDPOINTS.paymentPages.list
    );

  return data;
}

/**
 * ---------------------------------------------------------------------------
 * Get Payment Link
 * ---------------------------------------------------------------------------
 */
export async function getPaymentLink(
  id: number
) {
  const { data } =
    await authClient.get<ApiResponse<PaymentLink>>(
      API_ENDPOINTS.paymentPages.details(id)
    );

  return data;
}

/**
 * ---------------------------------------------------------------------------
 * Create Payment Link
 * ---------------------------------------------------------------------------
 */
export async function createPaymentLink(
  payload: CreatePaymentLinkRequest
) {
  const { data } =
    await authClient.post<ApiResponse<PaymentLink>>(
      API_ENDPOINTS.paymentPages.create,
      payload
    );

  return data;
}

/**
 * ---------------------------------------------------------------------------
 * Update Payment Link
 * ---------------------------------------------------------------------------
 */
export async function updatePaymentLink(
  payload: UpdatePaymentLinkRequest
) {
  const { data } =
    await authClient.put<ApiResponse<PaymentLink>>(
      API_ENDPOINTS.paymentPages.update,
      payload
    );

  return data;
}

/**
 * ---------------------------------------------------------------------------
 * Delete Payment Link
 * ---------------------------------------------------------------------------
 */
export async function deletePaymentLink(
  id: number
) {
  const { data } =
    await authClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.paymentPages.delete(id)
    );

  return data;
}

/**
 * ---------------------------------------------------------------------------
 * Validate Payment Link Reference
 * ---------------------------------------------------------------------------
 */
export async function validatePaymentLinkReference(
  reference: string
) {
  const { data } =
    await authClient.get<ApiResponse<boolean>>(
      API_ENDPOINTS.paymentPages.validateReference(
        reference
      )
    );

  return data;
}

/**
 * ---------------------------------------------------------------------------
 * Payment Link Transactions
 * ---------------------------------------------------------------------------
 */
export async function getPaymentLinkTransactions(
  paymentPageId: number
) {
  const { data } =
    await authClient.get<
      ApiResponse<PaymentLinkTransaction[]>
    >(
      API_ENDPOINTS.paymentPages.transactions(
        paymentPageId
      )
    );

  return data;
}