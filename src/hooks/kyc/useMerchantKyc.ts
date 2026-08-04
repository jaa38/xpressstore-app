import { useQuery } from "@tanstack/react-query";

import { kycService } from "@/services/kyc/kycService";

export function useMerchantKyc() {
  const query = useQuery({
    queryKey: ["merchant-kyc"],

    queryFn: () => kycService.getMerchantKyc(),
  });

  return {
    merchantKyc: query.data?.data,

    isLoading: query.isLoading,

    error: query.error,

    refetch: query.refetch,
  };
}
