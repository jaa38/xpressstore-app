import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth/authService";

export function useChangePassword() {
  return useMutation({
    mutationFn: authService.changePassword,
  });
}