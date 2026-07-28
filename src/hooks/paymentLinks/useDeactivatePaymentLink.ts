import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deactivatePaymentLink } from "@/services/paymentLink-service";

export function useDeactivatePaymentLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivatePaymentLink,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["paymentLinks"],
      });
    },
  });
}
