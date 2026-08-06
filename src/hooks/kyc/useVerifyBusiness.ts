import { useMutation } from "@tanstack/react-query";

import { kycService } from "@/services/kyc/kycService";

import type { ApiResponse } from "@/types/api";

import type {
  BusinessVerification,
  BusinessVerificationRequest,
} from "@/types/kyc";

export function useVerifyBusiness() {
  return useMutation<
    ApiResponse<BusinessVerification>,
    Error,
    BusinessVerificationRequest
  >({
    mutationFn: (payload) =>
      kycService.verifyBusiness(payload),
  });
}