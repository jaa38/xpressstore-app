import { useQuery } from "@tanstack/react-query";

import { getOrderById } from "@/services/order/order-service";

import { queryKeys } from "@/lib/queryKeys";

import { queryWithCache } from "@/database/query";

const ORDER_CACHE_MAX_AGE =
  1000 * 60 * 30;

export function useOrder(orderId?: string) {
  const queryKey = orderId
    ? queryKeys.order(orderId)
    : ([...queryKeys.orders, "detail"] as const);

  return useQuery({
    queryKey,

    queryFn: () => {
      if (!orderId) {
        throw new Error("Order ID is required.");
      }

      return queryWithCache(
        queryKey,
        () => getOrderById(orderId),
        {
          maxAge: ORDER_CACHE_MAX_AGE,
        }
      );
    },

    enabled: Boolean(orderId),
  });
}