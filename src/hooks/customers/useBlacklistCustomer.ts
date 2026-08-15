import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";

import { blacklistCustomer } from "@/services/customer/customer-service";

interface BlacklistCustomerVariables {
  id: string;
  isBlackListed: boolean;
}

export function useBlacklistCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isBlackListed }: BlacklistCustomerVariables) =>
      blacklistCustomer(id, isBlackListed),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customers,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.customer(variables.id),
      });
    },
  });
}
