import { useQuery } from "@tanstack/react-query";

import { merchantService } from "@/services/merchant/merchantService";

export function usePaymentMethods() {
  const query = useQuery({
    queryKey: ["payment-methods"],

    queryFn: merchantService.getPaymentMethods,
  });

  return {
    paymentMethods: query.data?.data,

    isLoading: query.isLoading,

    error: query.error,

    refetch: query.refetch,
  };
}