import {
  getPaymentLinks,
  getPaymentLink,
  createPaymentLink,
  updatePaymentLink,
  validatePaymentLinkReference,
  getPaymentLinkTransactions,
} from "@/api/payment-links/payment-links-api";

import {
  getMockPaymentLinks,
  getMockPaymentLinkById,
  createMockPaymentLink,
  updateMockPaymentLink,
  validateMockPaymentLinkReference,
  getMockPaymentLinkTransactions,
} from "@/mocks/paymentLinks";

import { USE_MOCK_PAYMENT_LINKS } from "@/mocks/config";

import type {
  CreatePaymentLinkRequest,
  UpdatePaymentLinkRequest,
} from "@/types/paymentLink";

export const paymentLinkService = {
  /**
   * =========================================================================
   * Get All Payment Links
   * =========================================================================
   */
  async getPaymentLinks() {
    if (USE_MOCK_PAYMENT_LINKS) {
      return {
        responseCode: "00",
        responseMessage: "Payment links loaded from mock data.",
        data: getMockPaymentLinks(),
      };
    }

    return getPaymentLinks();
  },

  /**
   * =========================================================================
   * Get Payment Link By Reference
   * =========================================================================
   */
  async getPaymentLink(merchantId: string, reference: string) {
    if (USE_MOCK_PAYMENT_LINKS) {
      const paymentLink = getMockPaymentLinks().find(
        (link) => link.paymentLinkReference === reference
      );

      if (!paymentLink) {
        throw new Error("Payment link not found.");
      }

      return {
        responseCode: "00",
        responseMessage: "Payment link loaded from mock data.",
        data: paymentLink,
      };
    }

    return getPaymentLink(merchantId, reference);
  },

  /**
   * =========================================================================
   * Create Payment Link
   * =========================================================================
   */
  async createPaymentLink(payload: CreatePaymentLinkRequest) {
    if (USE_MOCK_PAYMENT_LINKS) {
      return createMockPaymentLink(payload);
    }

    return createPaymentLink(payload);
  },

  /**
   * =========================================================================
   * Update Payment Link
   * =========================================================================
   */
  async updatePaymentLink(payload: UpdatePaymentLinkRequest) {
    if (USE_MOCK_PAYMENT_LINKS) {
      return updateMockPaymentLink(payload);
    }

    return updatePaymentLink(payload);
  },

  /**
   * =========================================================================
   * Validate Payment Link Reference
   * =========================================================================
   */
  async validatePaymentLinkReference(reference: string) {
    if (USE_MOCK_PAYMENT_LINKS) {
      return validateMockPaymentLinkReference(reference);
    }

    return validatePaymentLinkReference(reference);
  },

  /**
   * =========================================================================
   * Payment Link Transactions
   * =========================================================================
   */
  async getPaymentLinkTransactions(paymentPageId: number) {
    if (USE_MOCK_PAYMENT_LINKS) {
      return {
        responseCode: "00",
        responseMessage: "Payment link transactions loaded from mock data.",
        data: getMockPaymentLinkTransactions(paymentPageId),
      };
    }

    return getPaymentLinkTransactions(paymentPageId);
  },
};
