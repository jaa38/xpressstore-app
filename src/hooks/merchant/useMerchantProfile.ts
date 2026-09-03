import { useQuery } from "@tanstack/react-query";

import { merchantService } from "@/services/merchant/merchantService";

import { USE_MOCK_MERCHANT_PROFILE } from "@/mocks/config";
import { getMockMerchantProfile } from "@/mocks/merchant";

/**
 * ============================================================================
 * USE MERCHANT PROFILE
 * ============================================================================
 */

export function useMerchantProfile() {
  const query = useQuery({
    queryKey: ["merchant-profile"],

    queryFn: async () => {
      /**
       * ----------------------------------------------------------------------
       * MOCK MODE
       * ----------------------------------------------------------------------
       */

      if (USE_MOCK_MERCHANT_PROFILE) {
        return getMockMerchantProfile();
      }

      /**
       * ----------------------------------------------------------------------
       * API MODE
       * ----------------------------------------------------------------------
       */

      return merchantService.getProfile();
    },
  });

  return {
    profile: query.data?.data,

    isLoading: query.isLoading,

    error: query.error,

    refetch: query.refetch,
  };
}
