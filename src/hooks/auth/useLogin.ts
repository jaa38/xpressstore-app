import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth/authService";

import { mapLoginResponse } from "@/services/auth/authMapper";

import {
  saveAccessToken,
  saveCurrentUser,
  saveRefreshToken,
} from "@/storage/authStorage";

import { LoginRequest } from "@/types/auth";

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      /**
       * Call Xpress Login API
       */
      const response = await authService.login(payload);

      /**
       * Convert API response into
       * application session.
       */
      const session = mapLoginResponse(response.data);

      /**
       * Persist session.
       */
      await saveAccessToken(session.accessToken);

      await saveRefreshToken(session.refreshToken);

      await saveCurrentUser(session.user);

      return session;
    },
  });
}
