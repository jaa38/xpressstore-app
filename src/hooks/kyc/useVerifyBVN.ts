import { useMutation } from "@tanstack/react-query";

import { kycService } from "@/services/kyc/kycService";

export function useVerifyBVN() {
  return useMutation({
    mutationFn: kycService.verifyBVN,
  });
}