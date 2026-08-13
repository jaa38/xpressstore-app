import {
  getPaymentLinks,
  getPaymentLink,
  createPaymentLink,
  updatePaymentLink,
  validatePaymentLinkReference,
  getPaymentLinkTransactions,
} from "@/api/payment-links/payment-links-api";

import type {
  CreatePaymentLinkRequest,
  UpdatePaymentLinkRequest,
} from "@/types/paymentLink";

export const paymentLinkService = {
  /**
   * ---------------------------------------------------------------------------
   * Get All Payment Links
   * ---------------------------------------------------------------------------
   *
   * GET /PaymentPages/GetAllPages
   *
   * Returns all payment pages created by the authenticated merchant.
   */
  getPaymentLinks() {
    return getPaymentLinks();
  },

  /**
   * ---------------------------------------------------------------------------
   * Get Payment Link By Reference
   * ---------------------------------------------------------------------------
   *
   * GET /PaymentPages/GetAllPages/{merchantId}/{reference}
   *
   * Retrieves a payment page using the merchant ID and payment page
   * reference.
   */
  getPaymentLink(
    merchantId: string,
    reference: string
  ) {
    return getPaymentLink(
      merchantId,
      reference
    );
  },

  /**
   * ---------------------------------------------------------------------------
   * Create Payment Link
   * ---------------------------------------------------------------------------
   *
   * POST /PaymentPages/Add
   *
   * Creates a new payment page.
   */
  createPaymentLink(
    payload: CreatePaymentLinkRequest
  ) {
    return createPaymentLink(payload);
  },

  /**
   * ---------------------------------------------------------------------------
   * Update Payment Link
   * ---------------------------------------------------------------------------
   *
   * POST /PaymentPages/Update
   *
   * Updates an existing payment page.
   *
   * The backend expects the same fields as Add Payment Page with the
   * payment page `id` included.
   */
  updatePaymentLink(
    payload: UpdatePaymentLinkRequest
  ) {
    return updatePaymentLink(payload);
  },

  /**
   * ---------------------------------------------------------------------------
   * Validate Payment Link Reference
   * ---------------------------------------------------------------------------
   *
   * GET /PaymentPages/ValidatePaymentPageLinkRefernce/{reference}
   *
   * Checks whether a payment page reference is already in use.
   */
  validatePaymentLinkReference(
    reference: string
  ) {
    return validatePaymentLinkReference(
      reference
    );
  },

  /**
   * ---------------------------------------------------------------------------
   * Payment Link Transactions
   * ---------------------------------------------------------------------------
   *
   * GET /PaymentPages/GetPaymentPageTransactions/{paymentPageId}
   *
   * Returns transactions made through a specific payment page.
   */
  getPaymentLinkTransactions(
    paymentPageId: number
  ) {
    return getPaymentLinkTransactions(
      paymentPageId
    );
  },
};