import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { Order } from "@/types/order";

interface UpdateOrderStatusRequest {
  orderId: string;
  status: Order["status"];
}

interface UpdateContext {
  previousOrders?: Order[];
}

export function useUpdateOrderStatus() {
  const queryClient =
    useQueryClient();

  return useMutation<
    {
      orderId: string;
      status: Order["status"];
    },
    Error,
    UpdateOrderStatusRequest,
    UpdateContext
  >({
    mutationFn: async ({
      orderId,
      status,
    }) => {
      /**
       * Replace with Supabase/API later.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 600)
      );

      return {
        orderId,
        status,
      };
    },

    onMutate: async ({
      orderId,
      status,
    }) => {
      await queryClient.cancelQueries({
        queryKey: ["orders"],
      });

      const previousOrders =
        queryClient.getQueryData<
          Order[]
        >(["orders"]);

      queryClient.setQueryData<Order[]>(
        ["orders"],
        (orders = []) =>
          orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                  updatedAt:
                    new Date().toISOString(),
                }
              : order
          )
      );

      return {
        previousOrders,
      };
    },

    onError: (
      _error,
      _variables,
      context
    ) => {
      if (
        context?.previousOrders
      ) {
        queryClient.setQueryData(
          ["orders"],
          context.previousOrders
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
}