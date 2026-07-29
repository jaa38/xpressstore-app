import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deactivatePaymentLink } from "@/services/payment-link/paymentLink-service";

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
