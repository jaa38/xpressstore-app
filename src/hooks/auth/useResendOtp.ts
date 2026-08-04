import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth/authService";

export function useResendOtp() {
  return useMutation({
    mutationFn: authService.resendOtp,
  });
}