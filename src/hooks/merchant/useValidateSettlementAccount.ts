import { useMutation } from "@tanstack/react-query";

import { merchantService } from "@/services/merchant/merchantService";

export function useValidateSettlementAccount() {
  return useMutation({
    mutationFn: merchantService.validateSettlementAccount,
  });
}
