import { useQuery } from "@tanstack/react-query";

import { getOrders } from "@/services/order-service";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
}
