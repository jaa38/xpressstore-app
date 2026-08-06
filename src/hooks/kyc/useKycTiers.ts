import { useQuery } from "@tanstack/react-query";

import { kycService } from "@/services/kyc/kycService";

import { queryKeys } from "@/lib/queryKeys";

export function useKycTiers() {
  const query = useQuery({
    queryKey: queryKeys.kycTiers,

    queryFn: () => kycService.getKycTiers(),
  });

  return {
    kycTiers: query.data?.data ?? [],

    ...query,
  };
}