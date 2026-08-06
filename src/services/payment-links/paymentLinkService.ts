import {
  getPaymentLinks,
  getPaymentLink,
  createPaymentLink,
  updatePaymentLink,
  deletePaymentLink,
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
   * Get Payment Links
   * ---------------------------------------------------------------------------
   */
  getPaymentLinks() {
    return getPaymentLinks();
  },

  /**
   * ---------------------------------------------------------------------------
   * Get Payment Link
   * ---------------------------------------------------------------------------
   */
  getPaymentLink(id: number) {
    return getPaymentLink(id);
  },

  /**
   * ---------------------------------------------------------------------------
   * Create Payment Link
   * ---------------------------------------------------------------------------
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
   */
  updatePaymentLink(
    payload: UpdatePaymentLinkRequest
  ) {
    return updatePaymentLink(payload);
  },

  /**
   * ---------------------------------------------------------------------------
   * Delete Payment Link
   * ---------------------------------------------------------------------------
   */
  deletePaymentLink(id: number) {
    return deletePaymentLink(id);
  },

  /**
   * ---------------------------------------------------------------------------
   * Validate Payment Link Reference
   * ---------------------------------------------------------------------------
   */
  validatePaymentLinkReference(
    reference: string
  ) {
    return validatePaymentLinkReference(reference);
  },

  /**
   * ---------------------------------------------------------------------------
   * Payment Link Transactions
   * ---------------------------------------------------------------------------
   */
  getPaymentLinkTransactions(
    paymentPageId: number
  ) {
    return getPaymentLinkTransactions(paymentPageId);
  },
};