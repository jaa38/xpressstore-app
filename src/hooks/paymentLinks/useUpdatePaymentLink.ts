import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { paymentLinkService } from "@/services/payment-links/paymentLinkService";

import { queryKeys } from "@/lib/queryKeys";

export function useUpdatePaymentLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentLinkService.updatePaymentLink,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.paymentLinks,
      });
    },
  });
}