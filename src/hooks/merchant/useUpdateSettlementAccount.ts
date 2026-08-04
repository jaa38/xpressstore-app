import { useMutation, useQueryClient } from "@tanstack/react-query";

import { merchantService } from "@/services/merchant/merchantService";

export function useUpdateSettlementAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: merchantService.updateSettlementAccount,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["settlement-accounts"],
      });
    },
  });
}