import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth/authService";

import type {
  VerifyPasswordResetOtpRequest,
  VerifyPasswordResetOtpResponse,
} from "@/types/auth";

import type { ApiResponse } from "@/types/api";

export function useVerifyPasswordResetOtp() {
  return useMutation<
    ApiResponse<VerifyPasswordResetOtpResponse>,
    Error,
    VerifyPasswordResetOtpRequest
  >({
    mutationFn: (payload) =>
      authService.verifyPasswordResetOtp(payload),
  });
}