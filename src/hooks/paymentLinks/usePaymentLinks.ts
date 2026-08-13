import { useQuery } from "@tanstack/react-query";

import { paymentLinkService } from "@/services/payment-links/paymentLinkService";

import { queryKeys } from "@/lib/queryKeys";

/**
 * ---------------------------------------------------------------------------
 * Get Payment Links
 * ---------------------------------------------------------------------------
 *
 * Fetches all payment pages belonging to the authenticated merchant.
 *
 * Backend:
 * GET /PaymentPages/GetAllPages
 *
 * The API returns:
 *
 * {
 *   responseCode: "00",
 *   responseMessage: "Success",
 *   data: PaymentLink[]
 * }
 *
 * The hook exposes only `data` from the API response so the screen receives:
 *
 * PaymentLink[]
 */
export function usePaymentLinks() {
  return useQuery({
    queryKey: queryKeys.paymentLinks,

    queryFn: async () => {
      const response =
        await paymentLinkService.getPaymentLinks();

      return response.data;
    },
  });
}