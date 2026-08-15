import { useQuery } from "@tanstack/react-query";

import { storeService } from "@/services/store/storeService";

import { queryKeys } from "@/lib/queryKeys";

interface Props {
  storeId: number;
}

export function useStore({ storeId }: Props) {
  const query = useQuery({
    queryKey: queryKeys.store(storeId),

    queryFn: () => storeService.getStore(storeId),

    enabled: !!storeId,
  });

  return {
    store: query.data?.data,

    isLoading: query.isLoading,

    error: query.error,

    refetch: query.refetch,
  };
}