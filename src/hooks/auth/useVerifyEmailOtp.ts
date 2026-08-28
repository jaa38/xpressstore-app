import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth/authService";

import {
  saveAccessToken,
  saveCurrentUser,
  saveRefreshToken,
} from "@/storage/authStorage";

import type { VerifyEmailOtpRequest } from "@/types/auth";

import { useOnboardingStore } from "@/store/onboarding/onboardingStore";

export function useVerifyEmailOtp() {
  const setMerchantId = useOnboardingStore((state) => state.setMerchantId);

  return useMutation({
    mutationFn: async (payload: VerifyEmailOtpRequest) => {
      const response = await authService.verifyEmailOtp(payload);

      /**
       * -----------------------------------------------------------------------
       * Validate response
       * -----------------------------------------------------------------------
       */

      if (!response.data) {
        throw new Error(response.responseMessage || "Unable to verify email.");
      }

      const { token, data: user } = response.data;

      if (!token?.jwtToken) {
        throw new Error("Authentication token was not returned.");
      }

      if (!user) {
        throw new Error("User information was not returned.");
      }

      const merchantId = user.merchantDetails?.merchantId;

      if (!merchantId) {
        throw new Error("Merchant account information was not returned.");
      }

      /**
       * -----------------------------------------------------------------------
       * Persist authenticated session
       * -----------------------------------------------------------------------
       */

      await saveAccessToken(token.jwtToken);

      await saveRefreshToken(token.refreshToken);

      await saveCurrentUser(user);

      /**
       * -----------------------------------------------------------------------
       * Persist onboarding merchant ID
       * -----------------------------------------------------------------------
       */

      setMerchantId(merchantId);

      return response.data;
    },
  });
}
