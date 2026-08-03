import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth/authService";

import {
  saveAccessToken,
  saveRefreshToken,
  saveCurrentUser,
} from "@/storage/authStorage";

import { LoginRequest } from "@/types/auth";

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const response = await authService.login(payload);

      const { accessToken, refreshToken, user } = response.data;

      await saveAccessToken(accessToken);

      await saveRefreshToken(refreshToken);

      await saveCurrentUser(user);

      return response.data;
    },
  });
}
