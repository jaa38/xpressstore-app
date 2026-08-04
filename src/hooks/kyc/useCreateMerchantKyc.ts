import { useMutation } from "@tanstack/react-query";

import { kycService } from "@/services/kyc/kycService";

export function useCreateMerchantKyc() {
  return useMutation({
    mutationFn: kycService.createMerchantKyc,
  });
}