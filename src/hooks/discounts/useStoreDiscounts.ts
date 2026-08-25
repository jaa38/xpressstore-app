import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_STORES } from "@/mocks/config";

import { setMockStoreDiscounts } from "@/mocks/stores";

import type { Store, UpdateStoreRequest } from "@/types/store";

/**
 * ============================================================================
 * TYPES
 * ============================================================================
 */

interface UpdateStoreDiscountsVariables {
  storeId: number;

  discountIds: string[];
}

/**
 * ============================================================================
 * USE STORE DISCOUNTS
 * ============================================================================
 *
 * Updates the discount IDs associated with a store.
 *
 * MOCK MODE
 * ----------
 * Updates the isolated mock store state.
 *
 * API MODE
 * --------
 * Uses the existing UpdateStore API contract:
 *
 * storeDiscounts?: string[]
 *
 * No additional or undocumented API endpoint is introduced.
 * ============================================================================
 */

export function useStoreDiscounts() {
  const queryClient = useQueryClient();

  return useMutation<
    Store | void,
    Error,
    UpdateStoreDiscountsVariables
  >({
    mutationFn: async ({ storeId, discountIds }) => {
      /**
       * ----------------------------------------------------------------------
       * MOCK MODE
       * ----------------------------------------------------------------------
       */

      if (USE_MOCK_STORES) {
        const store = setMockStoreDiscounts(
          storeId,
          discountIds
        );

        if (!store) {
          throw new Error("Store not found.");
        }

        return store;
      }

      /**
       * ----------------------------------------------------------------------
       * REAL API MODE
       * ----------------------------------------------------------------------
       *
       * The existing useStore hook returns:
       *
       * query.data?.data
       */

      const cachedResponse = queryClient.getQueryData<{
        data?: Store;
      }>(queryKeys.store(storeId));

      const store = cachedResponse?.data;

      if (!store) {
        throw new Error(
          "Store data is unavailable. Please refresh the store and try again."
        );
      }

      const payload: UpdateStoreRequest = {
        id: store.storeId,

        storeName: store.storeName,

        currency: store.currency,

        storeReference: store.storeReference,

        storeLink: store.storeLink,

        isActive: store.isActive,

        themeColor: store.themeColor,

        welcomeMessage: store.welcomeMessage,

        description: store.description,

        callBackUrl: store.callBackUrl,

        successMessage: store.successMessage,

        whatsAppNumber: store.whatsAppNumber,

        phoneNumber: store.phoneNumber,

        email: store.email,

        instagram: store.instagram,

        facebook: store.facebook,

        twitter: store.twitter,

        storeProducts: store.products ?? [],

        storeDiscounts: discountIds,

      };

      await storeService.updateStore(payload);

      return undefined;
    },

    onSuccess: async (_, variables) => {
      /**
       * Refresh the complete store collection.
       */
      await queryClient.invalidateQueries({
        queryKey: queryKeys.stores,
      });

      /**
       * Refresh the individual store.
       */
      await queryClient.invalidateQueries({
        queryKey: queryKeys.store(
          variables.storeId
        ),
      });
    },
  });
}