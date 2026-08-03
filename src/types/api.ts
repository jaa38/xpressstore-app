/**
 * -----------------------------------------------------------------------------
 * Generic API Response
 * -----------------------------------------------------------------------------
 */

export interface ApiResponse<T> {
  succeeded: boolean;

  message: string;

  data: T;
}

/**
 * -----------------------------------------------------------------------------
 * Paginated API Response
 * -----------------------------------------------------------------------------
 */

export interface PaginatedResponse<T> {
  succeeded: boolean;

  message: string;

  data: T[];

  pageNumber: number;

  pageSize: number;

  totalRecords: number;

  totalPages: number;
}

/**
 * -----------------------------------------------------------------------------
 * API Error
 * -----------------------------------------------------------------------------
 */

export interface ApiError {
  succeeded: false;

  message: string;

  errors?: string[];

  statusCode?: number;
}

/**
 * -----------------------------------------------------------------------------
 * Pagination Request
 * -----------------------------------------------------------------------------
 */

export interface PaginationParams {
  pageNumber?: number;

  pageSize?: number;

  search?: string;
}

/**
 * -----------------------------------------------------------------------------
 * Authentication
 * -----------------------------------------------------------------------------
 */

export interface AuthTokens {
  accessToken: string;

  refreshToken: string;

  expiresIn: number;
}

/**
 * -----------------------------------------------------------------------------
 * Logged In User
 * -----------------------------------------------------------------------------
 */

export interface AuthenticatedUser {
  id: string;

  email: string;

  firstName: string;

  lastName: string;

  phoneNumber?: string;

  merchantId?: string;

  businessName?: string;
}

/**
 * -----------------------------------------------------------------------------
 * Login Request
 * -----------------------------------------------------------------------------
 */

export interface LoginRequest {
  email: string;

  password: string;
}

/**
 * -----------------------------------------------------------------------------
 * Register Request
 * -----------------------------------------------------------------------------
 */

export interface RegisterRequest {
  firstName: string;

  lastName: string;

  email: string;

  phoneNumber: string;

  password: string;
}

/**
 * -----------------------------------------------------------------------------
 * OTP Verification
 * -----------------------------------------------------------------------------
 */

export interface VerifyOtpRequest {
  email: string;

  otp: string;
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
  currentPassword: string;

  newPassword: string;

  confirmPassword: string;
}
