import { useQuery } from "@tanstack/react-query";

import { kycService } from "@/services/kyc/kycService";

import { queryKeys } from "@/lib/queryKeys";

export function useKycRequirements(kycTierId: number | null) {
  const query = useQuery({
    queryKey: queryKeys.kycRequirements(kycTierId ?? 0),

    queryFn: () => kycService.getKycRequirements(kycTierId!),

    enabled: !!kycTierId,
  });

  return {
    requirements: query.data?.data ?? [],

    ...query,
  };
}
