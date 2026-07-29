import { useMutation } from "@tanstack/react-query";

import { deletePaymentLink } from "@/services/payment-link/paymentLink-service";

import { queryClient } from "@/lib/query-client";

import { queryKeys } from "@/lib/queryKeys";

export function useDeletePaymentLink() {
  return useMutation({
    mutationFn: deletePaymentLink,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: queryKeys.paymentLinks,
      });
    },
  });
}