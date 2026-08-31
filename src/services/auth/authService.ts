import { authClient, apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

import { ApiResponse } from "@/types/api";

import {
  AuthUser,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UpdatePasswordRequest,
  VerifyEmailOtpRequest,
  VerifyEmailOtpResponse,
  VerifyPasswordResetOtpRequest,
} from "@/types/auth";

import { encodeLoginRequest } from "./authEncoder";

import {
  forgotPassword,
  verifyPasswordResetOtp,
} from "@/api/auth/password-recovery-api";

import {
  USE_MOCK_AUTH,
  registerMockUser,
  loginMockUser,
  verifyMockEmailOtp,
  resendMockOtp,
  updateMockPassword,
  forgotMockPassword,
  verifyMockPasswordResetOtp,
  resetMockPassword,
} from "@/mocks";

export const authService = {
  /**
   * =========================================================================
   * LOGIN
   * =========================================================================
   */

  async login(payload: LoginRequest) {
    if (USE_MOCK_AUTH) {
      const data = loginMockUser(payload.email, payload.password);

      return {
        responseCode: "00",
        responseMessage: "Login successful",
        data,
      };
    }

    const encodedPayload = encodeLoginRequest(payload);

    console.log("=================================");
    console.log("XPRESS LOGIN REQUEST");
    console.log("EMAIL:", encodedPayload.email);
    console.log(
      "PASSWORD ENCODED:",
      encodedPayload.password.substring(0, 10) + "..."
    );
    console.log("=================================");

    const { data } = await authClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.auth.login,
      encodedPayload
    );

    console.log("=================================");
    console.log("XPRESS LOGIN RESPONSE");
    console.log(JSON.stringify(data, null, 2));
    console.log("=================================");

    return data;
  },

  /**
   * =========================================================================
   * REGISTER
   * =========================================================================
   */

  async register(payload: RegisterRequest) {
    if (USE_MOCK_AUTH) {
      registerMockUser(payload);

      return {
        responseCode: "00",
        responseMessage: "Registration successful. Verification code sent.",
        data: undefined,
      };
    }

    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.auth.register,
      payload
    );

    return data;
  },

  /**
   * =========================================================================
   * VERIFY EMAIL OTP
   * =========================================================================
   */

  async verifyEmailOtp(payload: VerifyEmailOtpRequest) {
    if (USE_MOCK_AUTH) {
      const data = verifyMockEmailOtp(payload.email, payload.otp);

      return {
        responseCode: "00",
        responseMessage: "Email verified successfully",
        data,
      };
    }

    const { data } = await authClient.post<ApiResponse<VerifyEmailOtpResponse>>(
      API_ENDPOINTS.auth.verifyEmail,
      payload
    );

    return data;
  },

  /**
   * =========================================================================
   * RESEND EMAIL OTP
   * =========================================================================
   */

  async resendOtp(email: string) {
    if (USE_MOCK_AUTH) {
      resendMockOtp(email);

      return {
        responseCode: "00",
        responseMessage: "Verification code sent successfully",
        data: undefined,
      };
    }

    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.auth.resendOtp,
      null,
      {
        params: {
          Email: email,
        },
      }
    );

    return data;
  },

  /**
   * =========================================================================
   * UPDATE PASSWORD
   * =========================================================================
   *
   * Used by the signup/onboarding password flow.
   */

  async updatePassword(payload: UpdatePasswordRequest) {
    if (USE_MOCK_AUTH) {
      updateMockPassword(
        payload.email,
        payload.password,
        payload.confirmPassword
      );

      return {
        responseCode: "00",
        responseMessage: "Password updated successfully",
        data: undefined,
      };
    }

    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.auth.updatePassword,
      payload
    );

    return data;
  },

  /**
   * =========================================================================
   * FORGOT PASSWORD
   * =========================================================================
   */

  async forgotPassword(payload: ForgotPasswordRequest) {
    if (USE_MOCK_AUTH) {
      const data = forgotMockPassword(payload.email);

      return {
        responseCode: "00",
        responseMessage: "Password reset code sent successfully",
        data,
      };
    }

    return forgotPassword(payload);
  },

  /**
   * =========================================================================
   * VERIFY PASSWORD RESET OTP
   * =========================================================================
   */

  async verifyPasswordResetOtp(payload: VerifyPasswordResetOtpRequest) {
    if (USE_MOCK_AUTH) {
      const data = verifyMockPasswordResetOtp(payload.email, payload.otp);

      return {
        responseCode: "00",
        responseMessage: "Password reset code verified successfully",
        data,
      };
    }

    return verifyPasswordResetOtp(payload);
  },

  /**
   * =========================================================================
   * RESET PASSWORD
   * =========================================================================
   *
   * Used after successful password-reset OTP verification.
   *
   * Mock:
   *   resetMockPassword()
   *
   * Real API:
   *   updatePassword()
   */

  async resetPassword(payload: UpdatePasswordRequest) {
    if (USE_MOCK_AUTH) {
      resetMockPassword(
        payload.email,
        payload.password,
        payload.confirmPassword
      );

      return {
        responseCode: "00",
        responseMessage: "Password reset successfully",
        data: undefined,
      };
    }

    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.auth.updatePassword,
      payload
    );

    return data;
  },

  /**
   * =========================================================================
   * CHANGE PASSWORD
   * =========================================================================
   *
   * Used for an already authenticated user changing their password.
   */

  async changePassword(payload: ChangePasswordRequest) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.auth.changePassword,
      payload
    );

    return data;
  },

  /**
   * =========================================================================
   * FETCH CURRENT USER
   * =========================================================================
   */

  async getCurrentUser(token: string) {
    const { data } = await apiClient.get<ApiResponse<AuthUser>>(
      API_ENDPOINTS.auth.fetchUser,
      {
        params: {
          token,
        },
      }
    );

    return data;
  },
};
