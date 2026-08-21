import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { StoreLayout } from "@/types/store";

import { storeRepository } from "@/repositories/stores/sqliteStoreRepository";

import { queryKeys } from "@/lib/queryKeys";

/**
 * ============================================================================
 * USE STORE LAYOUT
 * ============================================================================
 *
 * Updates the local storefront layout preference.
 *
 * This does not call the backend because layout is currently not part of
 * the Store API.
 */

export function useStoreLayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      storeId,
      layout,
    }: {
      storeId: number;
      layout: StoreLayout;
    }) => {
      await storeRepository.updateStoreLayout(storeId, layout);

      return layout;
    },

    onSuccess: (_layout, variables) => {
      /**
       * Refresh the individual store.
       */
      queryClient.invalidateQueries({
        queryKey: queryKeys.store(variables.storeId),
      });

      /**
       * Refresh the store list.
       */
      queryClient.invalidateQueries({
        queryKey: queryKeys.stores,
      });
    },
  });
}
