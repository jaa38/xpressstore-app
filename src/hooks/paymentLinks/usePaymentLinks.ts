import { useQuery } from "@tanstack/react-query";

import { getPaymentLinks } from "@/services/payment-link/paymentLink-service";

import { queryKeys } from "@/lib/queryKeys";

export function usePaymentLinks() {
  return useQuery({
    queryKey: queryKeys.paymentLinks,
    queryFn: getPaymentLinks,
  });
}