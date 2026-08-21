import { useQuery } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

import { queryKeys } from "@/lib/queryKeys";

interface Props {
  storeId: number;
}

export function useStore({ storeId }: Props) {
  const query = useQuery({
    queryKey: queryKeys.store(storeId),

    queryFn: () => storeService.getStore(storeId),

    enabled: Number.isFinite(storeId) && storeId > 0,
  });

  return {
    store: query.data?.data,

    isLoading: query.isLoading,

    isFetching: query.isFetching,

    error: query.error,

    refetch: query.refetch,
  };
}
