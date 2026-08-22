import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";

import { deleteCustomer } from "@/services/customer/customer-service";

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,

    onSuccess: (_, customerId) => {
      /**
       * Remove the individual
       * customer query.
       */
      queryClient.removeQueries({
        queryKey: queryKeys.customer(customerId),
      });

      /**
       * Refresh customer collection.
       */
      queryClient.invalidateQueries({
        queryKey: queryKeys.customers,
      });
    },
  });
}
