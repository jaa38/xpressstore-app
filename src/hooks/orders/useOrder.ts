import { useQuery } from "@tanstack/react-query";

import { getOrderById } from "@/services/order/order-service";

import { queryKeys } from "@/lib/queryKeys";

export function useOrder(orderId?: string) {
  return useQuery({
    queryKey: orderId
      ? queryKeys.order(orderId)
      : [...queryKeys.orders, "detail"] as const,

    queryFn: () => {
      if (!orderId) {
        throw new Error("Order ID is required.");
      }

      return getOrderById(orderId);
    },

    enabled: Boolean(orderId),
  });
}