import { useQuery } from "@tanstack/react-query";

import { paymentLinkService } from "@/services/payment-links/paymentLinkService";

import { queryKeys } from "@/lib/queryKeys";

export function usePaymentLinks() {
  return useQuery({
    queryKey: queryKeys.paymentLinks,

    queryFn: paymentLinkService.getPaymentLinks,
  });
}