import { useQuery } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

import { queryKeys } from "@/lib/queryKeys";

export function useStores() {
  const query = useQuery({
    queryKey: queryKeys.stores,

    queryFn: storeService.getStores,
  });

  return {
    stores: query.data?.data ?? [],

    isLoading: query.isLoading,

    isRefetching: query.isRefetching,

    error: query.error,

    refetch: query.refetch,
  };
}
