import { authClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

import { clearSession } from "@/storage/authStorage";

import { ApiResponse } from "@/types/api";

import {
  AuthUser,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  VerifyOtpRequest,
} from "@/types/auth";

export const authService = {
  /**
   * ---------------------------------------------------------------------------
   * Login
   * ---------------------------------------------------------------------------
   */
  async login(payload: LoginRequest) {
    const { data } = await authClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.auth.login,
      payload
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
   * Verify OTP
   * ---------------------------------------------------------------------------
   */
  async verifyOtp(payload: VerifyOtpRequest) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.auth.verifyEmail,
      payload
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Forgot Password
   * ---------------------------------------------------------------------------
   */
  async forgotPassword(payload: ForgotPasswordRequest) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.auth.forgotPassword,
      payload
    );

    return data;
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
   * Current User
   * ---------------------------------------------------------------------------
   */
  async getCurrentUser() {
    const { data } = await authClient.get<ApiResponse<AuthUser>>(
      API_ENDPOINTS.auth.fetchUser
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Logout
   * ---------------------------------------------------------------------------
   */
  async logout() {
    await clearSession();

    return {
      succeeded: true,
      message: "Logged out successfully.",
      data: null,
    };
  },
};
