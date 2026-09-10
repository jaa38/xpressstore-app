import { useMutation } from "@tanstack/react-query";

import { merchantService } from "@/services/merchant/merchantService";

/**
 * ============================================================================
 * VALIDATE SETTLEMENT ACCOUNT
 * ============================================================================
 */

export function useValidateSettlementAccount() {
  return useMutation({
    mutationFn: merchantService.validateSettlementAccount,
  });
}
