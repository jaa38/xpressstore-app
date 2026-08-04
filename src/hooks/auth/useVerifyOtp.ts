import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth/authService";

import { VerifyOtpRequest } from "@/types/auth";

export function useVerifyOtp() {
  return useMutation({
    mutationFn: async (
      payload: VerifyOtpRequest
    ) => {
      return authService.verifyOtp(
        payload
      );
    },
  });
}