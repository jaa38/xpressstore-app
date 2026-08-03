/**
 * -----------------------------------------------------------------------------
 * Login
 * -----------------------------------------------------------------------------
 */

export interface LoginRequest {
  email: string;

  password: string;
}

export interface LoginToken {
  jwtToken: string;

  refreshToken: string;

  tokenExpireOn: string;
}

export interface MerchantDetails {
  merchantId: string;

  businessName: string;

  bvn?: string;
}

export interface AuthUser {
  firstName: string;

  middleName?: string;

  lastName: string;

  email: string;

  phoneNumber: string;

  roleName: string;

  isEmailVerified: boolean;

  isMerchantuserAdmin: boolean;

  merchantDetails: MerchantDetails;
}

export interface LoginResponse {
  token: LoginToken;

  data: AuthUser;
}

/**
 * -----------------------------------------------------------------------------
 * Register
 * -----------------------------------------------------------------------------
 */

export interface RegisterRequest {
  email: string;

  firstName: string;

  lastName: string;

  phoneNumber: string;
}

/**
 * -----------------------------------------------------------------------------
 * Verify Email
 * -----------------------------------------------------------------------------
 */

export interface VerifyOtpRequest {
  email: string;

  otp: string;
}

export interface VerifyOtpResponse {
  token: LoginToken;

  data: AuthUser;
}

/**
 * -----------------------------------------------------------------------------
 * Update Password
 * -----------------------------------------------------------------------------
 */

export interface UpdatePasswordRequest {
  email: string;

  password: string;

  confirmPassword: string;
}

/**
 * -----------------------------------------------------------------------------
 * Forgot Password
 * -----------------------------------------------------------------------------
 */

export interface ForgotPasswordRequest {
  email: string;
}

/**
 * -----------------------------------------------------------------------------
 * Change Password
 * -----------------------------------------------------------------------------
 */

export interface ChangePasswordRequest {
  oldPassword: string;

  newPassword: string;
}

/**
 * -----------------------------------------------------------------------------
 * Merchant Business Details
 * -----------------------------------------------------------------------------
 */

export interface UpdateBusinessDetailsRequest {
  merchantId: string;

  businessName: string;

  tradingName: string;

  businessEmail: string;

  businessPhoneNumber: string;
}