import { useQuery } from "@tanstack/react-query";

import { USE_MOCK_ORDERS } from "@/mocks/config";
import { getMockOrderById } from "@/mocks/orders";

import { getOrderById } from "@/services/order/order-service";

import { queryKeys } from "@/lib/queryKeys";

import type { Order } from "@/types/order";

export function useOrder(id: string) {
  return useQuery<Order | undefined>({
    queryKey: queryKeys.order(id),

    queryFn: async () => {
      if (USE_MOCK_ORDERS) {
        return getMockOrderById(id);
      }

      return getOrderById(id);
    },

    enabled: Boolean(id),
  });
}