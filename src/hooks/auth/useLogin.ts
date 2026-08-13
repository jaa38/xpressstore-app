import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth/authService";

import { mapLoginResponse } from "@/services/auth/authMapper";

import {
  saveAccessToken,
  saveCurrentUser,
  saveRefreshToken,
} from "@/storage/authStorage";

import type { LoginRequest } from "@/types/auth";

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      /**
       * -----------------------------------------------------------------------
       * Call Xpress Login API
       * -----------------------------------------------------------------------
       */
      const response = await authService.login(payload);

      /**
       * -----------------------------------------------------------------------
       * Validate API response
       * -----------------------------------------------------------------------
       *
       * Xpress can return a failed response with:
       *
       * responseCode: "10"
       * data: null
       *
       * Do not attempt to map a failed response into an authenticated session.
       */
      if (!response.data) {
        throw new Error(
          response.responseMessage || "Invalid email or password."
        );
      }

      /**
       * -----------------------------------------------------------------------
       * Map successful API response
       * -----------------------------------------------------------------------
       */
      const session = mapLoginResponse(response.data);

      /**
       * -----------------------------------------------------------------------
       * Persist authentication session
       * -----------------------------------------------------------------------
       */
      await saveAccessToken(session.accessToken);

      await saveRefreshToken(session.refreshToken);

      await saveCurrentUser(session.user);

      return session;
    },
  });
}