import { useQuery } from "@tanstack/react-query";

import { getOrders } from "@/services/order/order-service";

import { queryKeys } from "@/lib/queryKeys";

export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders,

    queryFn: getOrders,
  });
}