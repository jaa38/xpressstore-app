import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateOrderStatus } from "@/services/order/order-service";

import { queryKeys } from "@/lib/queryKeys";

import type { Order } from "@/types/order";

interface UpdateOrderStatusVariables {
  orderId: string;
  status: Order["status"];
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: UpdateOrderStatusVariables) =>
      updateOrderStatus(orderId, status),

    onSuccess: (_, variables) => {
      /**
       * Refresh the orders list.
       */
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders,
      });

      /**
       * Refresh the individual order.
       */
      queryClient.invalidateQueries({
        queryKey: queryKeys.order(variables.orderId),
      });
    },
  });
}