import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCustomer } from "@/services/customer-service";
import type { UpdateCustomerPayload } from "@/types/customer";

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      customer,
    }: {
      id: string;
      customer: UpdateCustomerPayload;
    }) => updateCustomer(id, customer),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["customers", variables.id],
      });
    },
  });
}
