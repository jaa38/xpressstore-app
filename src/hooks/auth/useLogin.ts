import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth/authService";

import { mapLoginResponse } from "@/services/auth/authMapper";

import {
  saveAccessToken,
  saveCurrentUser,
  saveRefreshToken,
} from "@/storage/authStorage";

import type { LoginRequest } from "@/types/auth";

/**
 * ============================================================================
 * LOGIN MUTATION
 * ============================================================================
 *
 * Handles the complete password login flow:
 *
 * 1. Call the Xpress Login API.
 * 2. Validate the API response.
 * 3. Map the API response into the application's session format.
 * 4. Persist the access token.
 * 5. Persist the refresh token.
 * 6. Persist the authenticated user.
 * 7. Return the authenticated session.
 *
 * The AuthProvider is responsible for updating the in-memory
 * authentication state after this mutation succeeds.
 */

export function useLogin() {
  return useMutation({
    /**
     * ==========================================================================
     * LOGIN REQUEST
     * ==========================================================================
     */

    mutationFn: async (
      payload: LoginRequest
    ) => {
      /**
       * ------------------------------------------------------------------------
       * CALL XPRESS LOGIN API
       * ------------------------------------------------------------------------
       */

      const response =
        await authService.login(
          payload
        );

      /**
       * ------------------------------------------------------------------------
       * VALIDATE API RESPONSE
       * ------------------------------------------------------------------------
       *
       * Xpress can return a failed response with:
       *
       * responseCode: "10"
       * data: null
       *
       * Do not attempt to map a failed response
       * into an authenticated session.
       */

      if (!response.data) {
        throw new Error(
          response.responseMessage ||
            "Invalid email or password."
        );
      }

      /**
       * ------------------------------------------------------------------------
       * MAP SUCCESSFUL API RESPONSE
       * ------------------------------------------------------------------------
       *
       * Convert the API response into the application's
       * standard authenticated session format.
       */

      const session =
        mapLoginResponse(
          response.data
        );

      /**
       * ------------------------------------------------------------------------
       * VALIDATE SESSION
       * ------------------------------------------------------------------------
       *
       * Ensure the login response produced the values
       * required to restore the authenticated session.
       */

      if (!session.accessToken) {
        throw new Error(
          "Login succeeded but no access token was returned."
        );
      }

      if (!session.refreshToken) {
        throw new Error(
          "Login succeeded but no refresh token was returned."
        );
      }

      if (!session.user) {
        throw new Error(
          "Login succeeded but no user information was returned."
        );
      }

      /**
       * ------------------------------------------------------------------------
       * PERSIST ACCESS TOKEN
       * ------------------------------------------------------------------------
       */

      await saveAccessToken(
        session.accessToken
      );

      /**
       * ------------------------------------------------------------------------
       * PERSIST REFRESH TOKEN
       * ------------------------------------------------------------------------
       */

      await saveRefreshToken(
        session.refreshToken
      );

      /**
       * ------------------------------------------------------------------------
       * PERSIST AUTHENTICATED USER
       * ------------------------------------------------------------------------
       */

      await saveCurrentUser(
        session.user
      );

      /**
       * ------------------------------------------------------------------------
       * RETURN AUTHENTICATED SESSION
       * ------------------------------------------------------------------------
       *
       * The LoginScreen will update AuthProvider
       * using session.user after this mutation succeeds.
       */

      return session;
    },
  });
}