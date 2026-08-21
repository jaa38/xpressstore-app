// src/hooks/orders/useOrder.ts

import { useQuery } from "@tanstack/react-query";

import { getMockOrderById } from "@/mocks/orders";
import { USE_MOCK_ORDERS } from "@/mocks/config";

import type { Order } from "@/types/order";

/**
 * ============================================================================
 * USE ORDER
 * ============================================================================
 */

export function useOrder(id: string) {
  return useQuery<Order | undefined>({
    queryKey: ["order", id],

    queryFn: async () => {
      /**
       * -----------------------------------------------------------------------
       * MOCK MODE
       * -----------------------------------------------------------------------
       */

      if (USE_MOCK_ORDERS) {
        return getMockOrderById(id);
      }

      /**
       * -----------------------------------------------------------------------
       * API MODE
       * -----------------------------------------------------------------------
       *
       * Replace this with the real Orders API once the service is available.
       */

      throw new Error("Orders API is not implemented yet.");
    },

    enabled: Boolean(id),
  });
}
