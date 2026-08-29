import type {
  BVNDetails,
  KycRequirement,
  KycTier,
  MerchantKyc,
  UploadDocumentResponse,
} from "@/types/kyc";

import type {
  UpdateBusinessDetailsRequest,
  UpdateBusinessTypeRequest,
} from "@/types/merchant";

/**
 * ============================================================================
 * MOCK ONBOARDING DATA
 * ============================================================================
 *
 * This file contains mock data and mock operations used during merchant
 * onboarding after authentication.
 *
 * Authentication is intentionally handled separately in:
 *
 * src/mocks/auth.ts
 *
 * Authentication flow:
 *
 * Register
 *   ↓
 * Verify Email OTP
 *   ↓
 * Set Password
 *   ↓
 * Login
 *
 * Onboarding flow:
 *
 * Business Details
 *   ↓
 * Business Type
 *   ↓
 * KYC Tier
 *   ↓
 * BVN / Documents
 *   ↓
 * Merchant KYC
 * ============================================================================
 */

/**
 * ---------------------------------------------------------------------------
 * Business Details
 * ---------------------------------------------------------------------------
 */

/**
 * Mock business details update.
 *
 * In mock mode we simply return the payload so the onboarding flow can
 * continue without making an API request.
 */
export function updateMockBusinessDetails(
  payload: UpdateBusinessDetailsRequest
) {
  return payload;
}

/**
 * ---------------------------------------------------------------------------
 * Business Type
 * ---------------------------------------------------------------------------
 */

/**
 * Mock business type update.
 */
export function updateMockBusinessType(payload: UpdateBusinessTypeRequest) {
  return payload;
}

/**
 * ============================================================================
 * KYC TIERS
 * ============================================================================
 */

export const MOCK_KYC_TIERS: KycTier[] = [
  {
    id: 1,

    name: "Basic",

    description: "Basic merchant verification",

    level: 1,

    isActive: true,
  },

  {
    id: 2,

    name: "Standard",

    description: "Standard merchant verification",

    level: 2,

    isActive: true,
  },

  {
    id: 3,

    name: "Enhanced",

    description: "Enhanced merchant verification",

    level: 3,

    isActive: true,
  },
];

/**
 * ---------------------------------------------------------------------------
 * Get KYC Tiers
 * ---------------------------------------------------------------------------
 */

export function getMockKycTiers(): KycTier[] {
  return [...MOCK_KYC_TIERS];
}

/**
 * ============================================================================
 * KYC REQUIREMENTS
 * ============================================================================
 */

export const MOCK_KYC_REQUIREMENTS: KycRequirement[] = [
  {
    id: 1,

    kycTierId: 1,

    documentType: "BVN",

    displayName: "BVN Verification",

    description: "Your verified BVN",

    required: true,
  },

  {
    id: 2,

    kycTierId: 2,

    documentType: "IDENTITY_DOCUMENT",

    displayName: "Identity Document",

    description: "Government-issued identity document",

    required: true,
  },

  {
    id: 3,

    kycTierId: 3,

    documentType: "IDENTITY_DOCUMENT",

    displayName: "Identity Document",

    description: "Government-issued identity document",

    required: true,
  },
];

/**
 * ---------------------------------------------------------------------------
 * Get KYC Requirements
 * ---------------------------------------------------------------------------
 */

export function getMockKycRequirements(kycTierId: number): KycRequirement[] {
  return MOCK_KYC_REQUIREMENTS.filter(
    (requirement) => requirement.kycTierId === kycTierId
  );
}

/**
 * ============================================================================
 * BVN
 * ============================================================================
 */

/**
 * Mock BVN verification.
 *
 * Test BVN:
 *
 * 22222222222
 */
export function verifyMockBVN(bvn: string): BVNDetails {
  if (bvn !== "22222222222") {
    throw new Error("Unable to verify the supplied BVN.");
  }

  return {
    bvn,

    firstName: "Jeremiah",

    lastName: "Akinsowon",

    dateOfBirth: "1995-01-01",

    phoneNumber: "08012345678",
  };
}

/**
 * ============================================================================
 * DOCUMENT UPLOAD
 * ============================================================================
 */

/**
 * Mock document upload.
 *
 * The real API would upload the document and return a URL.
 *
 * Mock mode generates a predictable local URL instead.
 */
export function uploadMockDocument(filename: string): UploadDocumentResponse {
  return {
    filename,

    url: `https://mock.xpressstore.local/documents/${encodeURIComponent(
      filename
    )}`,
  };
}

/**
 * ============================================================================
 * MERCHANT KYC
 * ============================================================================
 */

/**
 * Mock merchant KYC creation.
 */
export function createMockMerchantKyc(payload: {
  merchantId: string;

  kycTierId: string;

  documentType: string;

  documentUrl: string;

  bvn?: string;
}): MerchantKyc {
  return {
    merchantKycId: 1,

    merchantId: Number(payload.merchantId) || 1,

    kycTierId: Number(payload.kycTierId),

    status: "Pending",

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  };
}
