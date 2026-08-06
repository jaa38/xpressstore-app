import { useQuery } from "@tanstack/react-query";

import { paymentLinkService } from "@/services/payment-links/paymentLinkService";

import { queryKeys } from "@/lib/queryKeys";

export function usePaymentLinkTransactions(
  paymentPageId: number | null
) {
  return useQuery({
    queryKey: ["payment-link-transactions", paymentPageId],

    queryFn: () =>
      paymentLinkService.getPaymentLinkTransactions(paymentPageId!),

    enabled: paymentPageId !== null,
  });
}