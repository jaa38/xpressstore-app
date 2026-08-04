import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth/authService";

import { RegisterRequest } from "@/types/auth";

export function useRegister() {
  return useMutation({
    mutationFn: async (
      payload: RegisterRequest
    ) => {
      return authService.register(
        payload
      );
    },
  });
}