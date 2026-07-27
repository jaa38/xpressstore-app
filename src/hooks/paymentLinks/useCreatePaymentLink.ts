import { useMutation } from "@tanstack/react-query";

import { createPaymentLink } from "@/services/paymentLink-service";

import { queryClient } from "@/lib/query-client";

import { queryKeys } from "@/lib/queryKeys";

export function useCreatePaymentLink() {
  return useMutation({
    mutationFn: createPaymentLink,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: queryKeys.paymentLinks,
      });
    },
  });
}