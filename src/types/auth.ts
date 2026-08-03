/**
 * --------------------------------------------------------------------------
 * Login
 * --------------------------------------------------------------------------
 */

export interface LoginRequest {
  email: string;

  password: string;
}

export interface LoginResponse {
  accessToken: string;

  refreshToken: string;

  expiresIn: number;

  user: AuthUser;
}

/**
 * --------------------------------------------------------------------------
 * Register
 * --------------------------------------------------------------------------
 */

export interface RegisterRequest {
  firstName: string;

  lastName: string;

  email: string;

  phoneNumber: string;

  password: string;
}

/**
 * --------------------------------------------------------------------------
 * Verify Email
 * --------------------------------------------------------------------------
 */

export interface VerifyOtpRequest {
  email: string;

  otp: string;
}

/**
 * --------------------------------------------------------------------------
 * Forgot Password
 * --------------------------------------------------------------------------
 */

export interface ForgotPasswordRequest {
  email: string;
}

/**
 * --------------------------------------------------------------------------
 * Change Password
 * --------------------------------------------------------------------------
 */

export interface ChangePasswordRequest {
  currentPassword: string;

  newPassword: string;

  confirmPassword: string;
}

/**
 * --------------------------------------------------------------------------
 * Authenticated User
 * --------------------------------------------------------------------------
 */

export interface AuthUser {
  id: string;

  merchantId?: string;

  firstName: string;

  lastName: string;

  email: string;

  phoneNumber?: string;

  businessName?: string;

  isEmailVerified?: boolean;
}
