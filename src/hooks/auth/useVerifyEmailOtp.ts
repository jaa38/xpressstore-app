import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth/authService";

export function useVerifyEmailOtp() {
  return useMutation({
    mutationFn: authService.verifyEmailOtp,
  });
}