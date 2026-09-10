/**
 * -----------------------------------------------------------------------------
 * Merchant Profile
 * -----------------------------------------------------------------------------
 */

export interface MerchantProfile {
  merchantId: string;

  merchantCode: string;

  businessName: string;

  tradingName?: string;

  businessEmail: string;

  businessPhoneNumber: string;

  businessAddress: string;

  businessType: string;

  businessCategory: string;

  industry?: string;

  website?: string;

  logoUrl?: string;

  bvn?: string;

  isVerified: boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Update Merchant Business Details
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
 * Update Merchant Business Type
 * -----------------------------------------------------------------------------
 */

export interface UpdateBusinessTypeRequest {
  merchantId: string;

  businessTypeId: number;

  businessRegistrationTypeId: number;
}

/**
 * -----------------------------------------------------------------------------
 * Settlement Accounts
 * -----------------------------------------------------------------------------
 */

export interface SettlementAccount {
  settlementAccountId: string | number;

  bankName: string;

  bankCode: string;

  accountName: string;

  accountNumber: string;

  isDefault: boolean;
}

/**
 * Validate Settlement Account
 */

export interface ValidateSettlementAccountRequest {
  bankCode: string;

  accountNumber: string;
}

export interface ValidateSettlementAccountResponse {
  accountNumber: string;

  accountName: string;

  bankCode: string;

  bankName: string;
}

/**
 * -----------------------------------------------------------------------------
 * Update Settlement Account
 * -----------------------------------------------------------------------------
 */

export interface UpdateSettlementAccountRequest {
  /**
   * Provided when updating an existing settlement account.
   *
   * Omitted when creating a new settlement account.
   */
  settlementAccountId?: string | number;

  accountNumber: string;

  accountName: string;

  bankName: string;

  bankCode: string;

  isPrimary?: boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Payment Methods
 * -----------------------------------------------------------------------------
 */

export interface PaymentMethod {
  paymentMethodId: string;

  name: string;

  enabled: boolean;
}

export interface UpdatePaymentMethodRequest {
  paymentMethodId: string;

  enabled: boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Push Notifications
 * -----------------------------------------------------------------------------
 */

export interface RegisterPushNotificationRequest {
  deviceToken: string;

  platform: "ios" | "android";
}
