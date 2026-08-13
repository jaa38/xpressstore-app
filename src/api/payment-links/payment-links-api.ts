import { apiClient } from "@/api/client";
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
 * Get All Payment Pages
 * ---------------------------------------------------------------------------
 *
 * GET /PaymentPages/GetAllPages
 *
 * Returns all payment pages created by the merchant.
 */
export async function getPaymentLinks() {
  const { data } =
    await apiClient.get<ApiResponse<PaymentLink[]>>(
      API_ENDPOINTS.paymentPages.list
    );

  return data;
}

/**
 * ---------------------------------------------------------------------------
 * Get Payment Page By Reference
 * ---------------------------------------------------------------------------
 *
 * GET /PaymentPages/GetAllPages/{merchantId}/{reference}
 *
 * Retrieves a payment page using the merchant ID and
 * payment page reference.
 */
export async function getPaymentLink(
  merchantId: string,
  reference: string
) {
  const { data } =
    await apiClient.get<ApiResponse<PaymentLink>>(
      API_ENDPOINTS.paymentPages.byReference(
        merchantId,
        reference
      )
    );

  return data;
}

/**
 * ---------------------------------------------------------------------------
 * Create Payment Page
 * ---------------------------------------------------------------------------
 *
 * POST /PaymentPages/Add
 *
 * Creates a new payment page.
 *
 * The documented successful response contains:
 *
 * {
 *   responseCode: "00",
 *   responseMessage: "Payment page created",
 *   data: null
 * }
 */
export async function createPaymentLink(
  payload: CreatePaymentLinkRequest
) {
  const { data } =
    await apiClient.post<ApiResponse<null>>(
      API_ENDPOINTS.paymentPages.create,
      payload
    );

  return data;
}

/**
 * ---------------------------------------------------------------------------
 * Update Payment Page
 * ---------------------------------------------------------------------------
 *
 * POST /PaymentPages/Update
 *
 * Updates an existing payment page.
 *
 * The backend expects the same fields as Add Payment Page
 * with the payment page `id` included.
 *
 * The documented successful response contains:
 *
 * {
 *   responseCode: "00",
 *   responseMessage: "Payment page updated",
 *   data: null
 * }
 */
export async function updatePaymentLink(
  payload: UpdatePaymentLinkRequest
) {
  const { data } =
    await apiClient.post<ApiResponse<null>>(
      API_ENDPOINTS.paymentPages.update,
      payload
    );

  return data;
}

/**
 * ---------------------------------------------------------------------------
 * Validate Payment Page Reference
 * ---------------------------------------------------------------------------
 *
 * GET /PaymentPages/ValidatePaymentPageLinkRefernce/{reference}
 *
 * Checks whether a payment page reference is already in use.
 *
 * Note:
 * "Refernce" is intentionally preserved because this is
 * the spelling used by the backend endpoint.
 */
export async function validatePaymentLinkReference(
  reference: string
) {
  const { data } =
    await apiClient.get<
      ApiResponse<{
        isAvailable: boolean;
      }>
    >(
      API_ENDPOINTS.paymentPages.validateReference(
        reference
      )
    );

  return data;
}

/**
 * ---------------------------------------------------------------------------
 * Payment Page Transactions
 * ---------------------------------------------------------------------------
 *
 * GET /PaymentPages/GetPaymentPageTransactions/{paymentPageId}
 *
 * Returns transactions made through a specific payment page.
 */
export async function getPaymentLinkTransactions(
  paymentPageId: number
) {
  const { data } =
    await apiClient.get<
      ApiResponse<PaymentLinkTransaction[]>
    >(
      API_ENDPOINTS.paymentPages.transactions(
        paymentPageId
      )
    );

  return data;
}