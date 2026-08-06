import { authClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

import { ApiResponse } from "@/types/api";

import {
  AuthUser,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  VerifyEmailOtpRequest,
  VerifyPasswordResetOtpRequest,
} from "@/types/auth";

import { encodeLoginRequest } from "./authEncoder";

import {
  forgotPassword,
  verifyPasswordResetOtp,
} from "@/api/auth/password-recovery-api";

export const authService = {
  /**
   * ---------------------------------------------------------------------------
   * Login
   * ---------------------------------------------------------------------------
   */
  async login(payload: LoginRequest) {
    const encodedPayload = encodeLoginRequest(payload);

    const { data } = await authClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.auth.login,
      encodedPayload
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Register
   * ---------------------------------------------------------------------------
   */
  async register(payload: RegisterRequest) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.auth.register,
      payload
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Verify Email OTP
   * ---------------------------------------------------------------------------
   */
  async verifyEmailOtp(payload: VerifyEmailOtpRequest) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.auth.verifyEmail,
      payload
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Resend Verification Email
   * ---------------------------------------------------------------------------
   */
  async resendOtp(email: string) {
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
   * ---------------------------------------------------------------------------
   * Forgot Password
   * ---------------------------------------------------------------------------
   */
  forgotPassword(payload: ForgotPasswordRequest) {
    return forgotPassword(payload);
  },

  /**
   * ---------------------------------------------------------------------------
   * Verify Password Reset OTP
   * ---------------------------------------------------------------------------
   */
  verifyPasswordResetOtp(payload: VerifyPasswordResetOtpRequest) {
    return verifyPasswordResetOtp(payload);
  },

  /**
   * ---------------------------------------------------------------------------
   * Change Password
   * ---------------------------------------------------------------------------
   */
  async changePassword(payload: ChangePasswordRequest) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.auth.changePassword,
      payload
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Fetch Current User
   * ---------------------------------------------------------------------------
   */
  async getCurrentUser(token: string) {
    const { data } = await authClient.get<ApiResponse<AuthUser>>(
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
