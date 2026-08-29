import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth/authService";

import type { UpdatePasswordRequest } from "@/types/auth";

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: UpdatePasswordRequest) =>
      authService.resetPassword(payload),
  });
}