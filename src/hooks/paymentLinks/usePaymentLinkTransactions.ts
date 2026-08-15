import { useQuery } from "@tanstack/react-query";

import { paymentLinkService } from "@/services/payment-links/paymentLinkService";

import { queryKeys } from "@/lib/queryKeys";

export function usePaymentLinkTransactions(
  paymentPageId: number | null
) {
  return useQuery({
    queryKey:
      paymentPageId !== null
        ? queryKeys.paymentLinkTransactions(paymentPageId)
        : ["payment-link-transactions", "disabled"],

    queryFn: () =>
      paymentLinkService.getPaymentLinkTransactions(paymentPageId!),

    enabled: paymentPageId !== null,
  });
}