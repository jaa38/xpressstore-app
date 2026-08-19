import { useQuery } from "@tanstack/react-query";

import { storeService } from "@/services/store/storeService";

export function useShippingRegions() {
  const query = useQuery({
    queryKey: ["shipping-regions"],

    queryFn: storeService.getShippingRegions,
  });

  return {
    shippingRegions: query.data?.data ?? [],

    isLoading: query.isLoading,

    error: query.error,

    refetch: query.refetch,
  };
}
