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
 * Merchant Business Type
 * -----------------------------------------------------------------------------
 */

export interface UpdateBusinessTypeRequest {
  merchantId: string;

  businessType: string;
}

/**
 * -----------------------------------------------------------------------------
 * Settlement Accounts
 * -----------------------------------------------------------------------------
 */

export interface SettlementAccount {
  settlementAccountId: string;

  bankName: string;

  bankCode: string;

  accountName: string;

  accountNumber: string;

  isDefault: boolean;
}

export interface UpdateSettlementAccountRequest {
  settlementAccountId: string;

  bankCode: string;

  accountNumber: string;

  accountName: string;
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
