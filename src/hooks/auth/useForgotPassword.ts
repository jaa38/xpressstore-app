import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth/authService";

import { ForgotPasswordRequest } from "@/types/auth";

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (
      payload: ForgotPasswordRequest
    ) => {
      return authService.forgotPassword(
        payload
      );
    },
  });
}