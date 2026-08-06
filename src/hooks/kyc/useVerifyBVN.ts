import { useMutation } from "@tanstack/react-query";

import { kycService } from "@/services/kyc/kycService";

import type { ApiResponse } from "@/types/api";

import type {
  BVNDetails,
  VerifyBVNRequest,
} from "@/types/kyc";

export function useVerifyBVN() {
  return useMutation<
    ApiResponse<BVNDetails>,
    Error,
    VerifyBVNRequest
  >({
    mutationFn: (payload) =>
      kycService.verifyBVN(payload),
  });
}