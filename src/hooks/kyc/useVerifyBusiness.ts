import { useMutation } from "@tanstack/react-query";

import { kycService } from "@/services/kyc/kycService";

export function useVerifyBusiness() {
  return useMutation({
    mutationFn: kycService.verifyBusiness,
  });
}