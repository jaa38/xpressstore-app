import { useMutation, useQueryClient } from "@tanstack/react-query";

import { merchantService } from "@/services/merchant/merchantService";

export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: merchantService.updatePaymentMethod,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payment-methods"],
      });
    },
  });
}