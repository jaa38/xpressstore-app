import { authClient } from "@/api/client";

import type { ApiResponse } from "@/types/api";

import type {
  VerifyPasswordResetOtpRequest,
  VerifyPasswordResetOtpResponse,
} from "@/types/auth";

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

/**
 * ------------------------------------------------------------------
 * Request Password Reset Email
 * ------------------------------------------------------------------
 */
export async function forgotPassword(payload: ForgotPasswordRequest) {
  const { data } = await authClient.post<ApiResponse<ForgotPasswordResponse>>(
    "/api/v2/Account/ForgetPassword",
    payload
  );

  return data;
}

/**
 * ------------------------------------------------------------------
 * Verify Password Reset OTP
 * ------------------------------------------------------------------
 */
export async function verifyPasswordResetOtp(
  payload: VerifyPasswordResetOtpRequest
) {
  const { data } =
    await authClient.post<
      ApiResponse<VerifyPasswordResetOtpResponse>
    >(
      "/api/v2/Account/VerifyPasswordResetOtp",
      payload
    );

  return data;
}


