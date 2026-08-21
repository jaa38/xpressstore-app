import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeService } from "@/services/store/storeService";

import { queryKeys } from "@/lib/queryKeys";

export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (storeId: number) => storeService.deleteStore(storeId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.stores,
      });
    },
  });
}