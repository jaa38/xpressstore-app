import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";

import { updateCustomer } from "@/services/customer-service";

import type { UpdateCustomerPayload } from "@/types/customer";

interface UpdateCustomerMutation {
  id: string;
  customer: UpdateCustomerPayload;
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      customer,
    }: UpdateCustomerMutation) =>
      updateCustomer(id, customer),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customers,
      });
    },
  });
}