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
 * Email Verification
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

export interface ResendOtpRequest {
  email: string;
}

/**
 * -----------------------------------------------------------------------------
 * Password Recovery
 * -----------------------------------------------------------------------------
 */

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface VerifyPasswordResetOtpRequest {
  email: string;

  otp: string;
}

export interface VerifyPasswordResetOtpResponse {
  message: string;
}

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