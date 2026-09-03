import type { ApiResponse } from "@/types/api";
import type { MerchantProfile } from "@/types/merchant";

/**
 * ============================================================================
 * MOCK MERCHANT PROFILE
 * ============================================================================
 */

const MOCK_MERCHANT_PROFILE: MerchantProfile = {
  merchantId: "mock-merchant-001",

  merchantCode: "MOCK-MERCHANT-001",

  businessName: "Xpress Store",

  tradingName: "Xpress Store",

  businessEmail: "merchant@example.com",

  businessPhoneNumber: "08000000000",

  businessAddress: "Lagos, Nigeria",

  businessType: "Retail",

  businessCategory: "General",

  industry: "Retail",

  website: "https://xpressstore.com",

  logoUrl: undefined,

  bvn: undefined,

  isVerified: true,
};

/**
 * ============================================================================
 * GET MOCK MERCHANT PROFILE
 * ============================================================================
 */

export function getMockMerchantProfile(): ApiResponse<MerchantProfile> {
  return {
    responseCode: "00",
    responseMessage: "Merchant profile retrieved successfully",
    data: {
      ...MOCK_MERCHANT_PROFILE,
    },
  };
}
