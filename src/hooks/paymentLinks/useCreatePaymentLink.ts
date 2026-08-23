import { useMutation, useQueryClient } from "@tanstack/react-query";

import { paymentLinkService } from "@/services/payment-links/paymentLink-service";

import { queryKeys } from "@/lib/queryKeys";

export function useCreatePaymentLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentLinkService.createPaymentLink,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.paymentLinks,
      });
    },
  });
}
