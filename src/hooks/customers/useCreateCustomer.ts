import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";

import {
  createCustomer,
  getCustomers,
} from "@/services/customer/customer-service";

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.customers,
      });

      await queryClient.refetchQueries({
        queryKey: queryKeys.customers,
      });
    },
  });
}