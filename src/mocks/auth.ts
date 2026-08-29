import type {
  AuthUser,
  LoginResponse,
  RegisterRequest,
  VerifyEmailOtpResponse,
} from "@/types/auth";

/**
 * ============================================================================
 * MOCK AUTHENTICATION
 * ============================================================================
 *
 * This file contains the complete local authentication data flow.
 *
 * It intentionally has no dependency on the real authentication API.
 *
 * Flow:
 *
 * Register
 *   ↓
 * Verify Email OTP
 *   ↓
 * Set Password
 *   ↓
 * Login
 *
 * Default verification OTP:
 *
 * 123456
 * ============================================================================
 */

interface MockAuthAccount {
  user: AuthUser;

  password: string | null;

  emailVerified: boolean;

  verificationOtp: string;

  passwordResetOtp: string;

  passwordResetVerified: boolean;
}

/**
 * ---------------------------------------------------------------------------
 * Default mock account
 * ---------------------------------------------------------------------------
 *
 * This account is useful for testing login before going through signup.
 *
 * Password:
 *
 * Password123!
 *
 * Email:
 *
 * merchant@example.com
 * ---------------------------------------------------------------------------
 */

const DEFAULT_MOCK_ACCOUNT: MockAuthAccount = {
  user: {
    firstName: "Jeremiah",

    lastName: "Akinsowon",

    email: "merchant@example.com",

    phoneNumber: "08012345678",

    roleName: "Merchant",

    isEmailVerified: true,

    isMerchantUserAdmin: true,

    merchantDetails: {
      merchantId: "mock-merchant-001",

      businessName: "Xpress Store",

      tradingName: "Xpress Store",

      businessEmail: "merchant@example.com",

      businessPhoneNumber: "08012345678",

      bvn: "22222222222",
    },
  },

  password: "Password123!",

  emailVerified: true,

  verificationOtp: "123456",

  passwordResetOtp: "654321",

  passwordResetVerified: false,
};

/**
 * ---------------------------------------------------------------------------
 * Mock database
 * ---------------------------------------------------------------------------
 *
 * Each signup adds a new account to this array.
 * ---------------------------------------------------------------------------
 */

const MOCK_AUTH_ACCOUNTS: MockAuthAccount[] = [DEFAULT_MOCK_ACCOUNT];

/**
 * ---------------------------------------------------------------------------
 * Constants
 * ---------------------------------------------------------------------------
 */

export const MOCK_VERIFICATION_OTP = "123456";

export const MOCK_PASSWORD_RESET_OTP = "654321";

/**
 * ---------------------------------------------------------------------------
 * Token
 * ---------------------------------------------------------------------------
 */

function createMockToken(email: string) {
  const timestamp = Date.now();

  return {
    jwtToken: `mock-jwt-${timestamp}-${email}`,

    refreshToken: `mock-refresh-${timestamp}`,

    tokenExpireOn: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  };
}

/**
 * ---------------------------------------------------------------------------
 * Find account
 * ---------------------------------------------------------------------------
 */

function findAccount(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  return MOCK_AUTH_ACCOUNTS.find(
    (account) => account.user.email.trim().toLowerCase() === normalizedEmail
  );
}

/**
 * ---------------------------------------------------------------------------
 * Register
 * ---------------------------------------------------------------------------
 */

export function registerMockUser(payload: RegisterRequest) {
  const email = payload.email.trim().toLowerCase();

  const existingAccount = findAccount(email);

  if (existingAccount) {
    throw new Error("An account with this email address already exists.");
  }

  const merchantId = `mock-merchant-${Date.now()}`;

  const user: AuthUser = {
    firstName: payload.firstName.trim(),

    lastName: payload.lastName.trim(),

    email,

    phoneNumber: payload.phoneNumber.trim(),

    roleName: "Merchant",

    isEmailVerified: false,

    isMerchantUserAdmin: true,

    merchantDetails: {
      merchantId,

      businessName: "",

      tradingName: "",

      businessEmail: email,

      businessPhoneNumber: payload.phoneNumber.trim(),
    },
  };

  const account: MockAuthAccount = {
    user,

    password: null,

    emailVerified: false,

    verificationOtp: MOCK_VERIFICATION_OTP,

    passwordResetOtp: MOCK_PASSWORD_RESET_OTP,

    passwordResetVerified: false,
  };

  MOCK_AUTH_ACCOUNTS.push(account);

  console.log("=================================");
  console.log("MOCK REGISTER");
  console.log("EMAIL:", email);
  console.log("OTP:", MOCK_VERIFICATION_OTP);
  console.log("MERCHANT ID:", merchantId);
  console.log("=================================");

  return user;
}

/**
 * ---------------------------------------------------------------------------
 * Login
 * ---------------------------------------------------------------------------
 */

export function loginMockUser(email: string, password: string): LoginResponse {
  const account = findAccount(email);

  if (!account) {
    throw new Error("Invalid email or password.");
  }

  if (!account.password) {
    throw new Error("Your account has not been assigned a password yet.");
  }

  if (account.password !== password) {
    throw new Error("Invalid email or password.");
  }

  if (!account.emailVerified) {
    throw new Error("Please verify your email before signing in.");
  }

  const token = createMockToken(account.user.email);

  return {
    token,

    data: {
      ...account.user,

      isEmailVerified: true,
    },
  };
}

/**
 * ---------------------------------------------------------------------------
 * Verify Email OTP
 * ---------------------------------------------------------------------------
 */

export function verifyMockEmailOtp(
  email: string,
  otp: string
): VerifyEmailOtpResponse {
  const account = findAccount(email);

  if (!account) {
    throw new Error("No account was found for this email address.");
  }

  if (otp !== account.verificationOtp) {
    throw new Error("Invalid verification code.");
  }

  account.emailVerified = true;

  account.user = {
    ...account.user,

    isEmailVerified: true,
  };

  const token = createMockToken(account.user.email);

  console.log("=================================");
  console.log("MOCK EMAIL VERIFIED");
  console.log("EMAIL:", account.user.email);
  console.log("=================================");

  return {
    token,

    data: account.user,
  };
}

/**
 * ---------------------------------------------------------------------------
 * Resend Email OTP
 * ---------------------------------------------------------------------------
 */

export function resendMockOtp(email: string) {
  const account = findAccount(email);

  if (!account) {
    throw new Error("No account was found for this email address.");
  }

  account.verificationOtp = MOCK_VERIFICATION_OTP;

  console.log("=================================");
  console.log("MOCK RESEND OTP");
  console.log("EMAIL:", account.user.email);
  console.log("OTP:", account.verificationOtp);
  console.log("=================================");

  return undefined;
}

/**
 * ---------------------------------------------------------------------------
 * Set Password
 * ---------------------------------------------------------------------------
 */

export function updateMockPassword(
  email: string,
  password: string,
  confirmPassword: string
) {
  const account = findAccount(email);

  if (!account) {
    throw new Error("No account was found for this email address.");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  account.password = password;

  console.log("=================================");
  console.log("MOCK PASSWORD UPDATED");
  console.log("EMAIL:", account.user.email);
  console.log("=================================");

  return undefined;
}

/**
 * ---------------------------------------------------------------------------
 * Forgot Password
 * ---------------------------------------------------------------------------
 */

export function forgotMockPassword(email: string) {
  const account = findAccount(email);

  if (!account) {
    throw new Error("No account was found for this email address.");
  }

  account.passwordResetOtp = MOCK_PASSWORD_RESET_OTP;

  account.passwordResetVerified = false;

  console.log("=================================");
  console.log("MOCK PASSWORD RESET OTP");
  console.log("EMAIL:", account.user.email);
  console.log("OTP:", account.passwordResetOtp);
  console.log("=================================");

  return {
    message: "Password reset code sent successfully.",
  };
}

/**
 * ---------------------------------------------------------------------------
 * Verify Password Reset OTP
 * ---------------------------------------------------------------------------
 */

export function verifyMockPasswordResetOtp(email: string, otp: string) {
  const account = findAccount(email);

  if (!account) {
    throw new Error("No account was found for this email address.");
  }

  if (otp !== account.passwordResetOtp) {
    throw new Error("Invalid verification code.");
  }

  account.passwordResetVerified = true;

  return {
    message: "Password reset code verified successfully.",
  };
}

/**
 * ---------------------------------------------------------------------------
 * Reset Password
 * ---------------------------------------------------------------------------
 */

export function resetMockPassword(
  email: string,
  password: string,
  confirmPassword: string
) {
  const account = findAccount(email);

  if (!account) {
    throw new Error("No account was found for this email address.");
  }

  if (!account.passwordResetVerified) {
    throw new Error("Please verify the password reset code first.");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  account.password = password;

  account.passwordResetVerified = false;

  return undefined;
}

/**
 * ---------------------------------------------------------------------------
 * Get Mock Account
 * ---------------------------------------------------------------------------
 *
 * Useful during development/debugging.
 * ---------------------------------------------------------------------------
 */

export function getMockAuthAccount(email: string) {
  return findAccount(email);
}
