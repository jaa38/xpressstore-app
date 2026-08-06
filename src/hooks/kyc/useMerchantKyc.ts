import { useQuery } from "@tanstack/react-query";

import { kycService } from "@/services/kyc/kycService";

import { queryKeys } from "@/lib/queryKeys";

export function useMerchantKyc(
  merchantId: string | null
) {
  const query = useQuery({
    queryKey: merchantId
      ? queryKeys.merchantKyc(merchantId)
      : queryKeys.merchantKycs,

    queryFn: () =>
      kycService.getMerchantKyc(merchantId!),

    enabled: !!merchantId,
  });

  return {
    merchantKyc: query.data?.data ?? [],

    ...query,
  };
}