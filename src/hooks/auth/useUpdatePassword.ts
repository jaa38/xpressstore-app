import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth/authService";

export function useUpdatePassword() {
  return useMutation({
    mutationFn: authService.updatePassword,
  });
}