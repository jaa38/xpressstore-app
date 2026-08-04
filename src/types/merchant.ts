export interface MerchantProfile {
  merchantCode: string;

  businessName: string;

  businessEmail: string;

  businessPhone: string;

  businessAddress: string;

  businessType: string;

  businessCategory: string;

  industry: string;

  website?: string;

  logoUrl?: string;

  isVerified: boolean;
}

export interface UpdateBusinessDetailsRequest {
  businessName: string;

  businessAddress: string;

  businessCategory: string;
}

export interface UpdateBusinessTypeRequest {
  businessType: string;
}

export interface SettlementAccount {
  accountName: string;

  accountNumber: string;

  bankCode: string;

  bankName: string;
}
