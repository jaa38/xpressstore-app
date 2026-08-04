import { useMutation, useQueryClient } from "@tanstack/react-query";

import { merchantService } from "@/services/merchant/merchantService";

export function useDeleteSettlementAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: merchantService.deleteSettlementAccount,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["settlement-accounts"],
      });
    },
  });
}