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

  tradingName?: string;

  businessEmail?: string;

  businessPhoneNumber?: string;

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

  isMerchantUserAdmin: boolean;

  merchantDetails: MerchantDetails;
}

export interface LoginResponse {
  token: LoginToken;

  data: AuthUser;
}

export interface AuthSession {
  accessToken: string;

  refreshToken: string;

  expiresAt: string;

  user: AuthUser;
}

/**
 * -----------------------------------------------------------------------------
 * Register
 * -----------------------------------------------------------------------------
 */

export interface RegisterRequest {
  email: string;

  password: string;
}

/**
 * -----------------------------------------------------------------------------
 * Verify Email
 * -----------------------------------------------------------------------------
 */

export interface VerifyEmailOtpRequest {
  email: string;

  otp: string;
}

export interface VerifyEmailOtpResponse {
  token: LoginToken;

  data: AuthUser;
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

export interface VerifyEmailOtpRequest {
  email: string;

  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

/**
 * -----------------------------------------------------------------------------
 * Complete Profile
 * -----------------------------------------------------------------------------
 */

export interface CompleteProfileRequest {
  firstName: string;

  lastName: string;

  phoneNumber: string;
}
