import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

import { queryKeys } from "@/lib/queryKeys";

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeService.updateStore,

    onSuccess: (_data, variables) => {
      /**
       * Refresh the store list.
       */
      queryClient.invalidateQueries({
        queryKey: queryKeys.stores,
      });

      /**
       * Refresh the specific store being edited.
       */
      queryClient.invalidateQueries({
        queryKey: queryKeys.store(variables.id),
      });
    },
  });
}
