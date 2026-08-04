import { useQuery } from "@tanstack/react-query";

import { kycService } from "@/services/kyc/kycService";

export function useMerchantKyc(merchantId: string | null) {
  const query = useQuery({
    queryKey: ["merchant-kyc", merchantId],

    queryFn: () => kycService.getMerchantKyc(merchantId!),

    enabled: !!merchantId,
  });

  return {
    merchantKyc: query.data?.data,

    isLoading: query.isLoading,

    error: query.error,

    refetch: query.refetch,
  };
}