import { useQuery } from "@tanstack/react-query";

import { storeService } from "@/services/store/storeService";

export function useStores() {
  const query = useQuery({
    queryKey: ["stores"],

    queryFn: storeService.getStores,
  });

  return {
    stores: query.data?.data ?? [],

    isLoading: query.isLoading,

    error: query.error,

    refetch: query.refetch,
  };
}