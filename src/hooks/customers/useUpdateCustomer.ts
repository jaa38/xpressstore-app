import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";

import { updateCustomer } from "@/services/customer/customer-service";

import type { UpdateCustomerPayload } from "@/types/customer";

interface UpdateCustomerVariables {
  id: string;

  customer: UpdateCustomerPayload;
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, customer }: UpdateCustomerVariables) =>
      updateCustomer(id, customer),

    onSuccess: (updatedCustomer, variables) => {
      /**
       * Update the individual query
       * immediately with the returned
       * customer.
       */
      queryClient.setQueryData(
        queryKeys.customer(variables.id),
        updatedCustomer
      );

      /**
       * Refresh customer collection.
       */
      queryClient.invalidateQueries({
        queryKey: queryKeys.customers,
      });
    },
  });
}
