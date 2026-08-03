import { useQuery } from "@tanstack/react-query";

import { getOrders } from "@/services/order/order-service";

import type { Order } from "@/types/order";

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
}