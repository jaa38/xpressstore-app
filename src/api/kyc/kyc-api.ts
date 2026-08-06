import { authClient } from "@/api/client";

import type { ApiResponse } from "@/types/api";

import type {
  BVNDetails,
  BusinessVerification,
  MerchantKyc,
  MerchantKycRequest,
  UploadDocumentResponse,
} from "@/types/kyc";

/**
 * --------------------------------------------------------------------------
 * Get All KYC Tiers
 * --------------------------------------------------------------------------
 */
export async function getKycTiers() {
  const { data } = await authClient.get<ApiResponse<any[]>>(
    "/kycTiers/GetAllkycTiers"
  );

  return data;
}

/**
 * --------------------------------------------------------------------------
 * Get KYC Requirements By Tier
 * --------------------------------------------------------------------------
 */
export async function getKycRequirements(
  kycTierId: string
) {
  const { data } = await authClient.get<ApiResponse<any[]>>(
    "/KycTiers/GetKycRequirementByKycTier",
    {
      params: {
        kycTierId,
      },
    }
  );

  return data;
}

/**
 * --------------------------------------------------------------------------
 * Create Merchant KYC
 * --------------------------------------------------------------------------
 */
export async function createMerchantKyc(
  payload: MerchantKycRequest
) {
  const { data } = await authClient.post<ApiResponse<void>>(
    "/MerchantKyc/CreateMerchantKyc",
    payload
  );

  return data;
}

/**
 * --------------------------------------------------------------------------
 * Create Merchant KYC (StoreFront)
 * --------------------------------------------------------------------------
 */
export async function createMerchantKycStoreFront(
  payload: MerchantKycRequest
) {
  const { data } = await authClient.post<ApiResponse<void>>(
    "/StoreFront/CreateMerchantKycStoreFront",
    payload
  );

  return data;
}

/**
 * --------------------------------------------------------------------------
 * Get Merchant KYC
 * --------------------------------------------------------------------------
 */
export async function getMerchantKyc(
  merchantId: string
) {
  const { data } = await authClient.get<
    ApiResponse<MerchantKyc[]>
  >(
    "/MerchantKyc/GetMerchantKycAll",
    {
      params: {
        merchantId,
      },
    }
  );

  return data;
}

/**
 * --------------------------------------------------------------------------
 * Upload KYC Document
 * --------------------------------------------------------------------------
 */
export async function uploadKycDocument(
  formData: FormData
) {
  const { data } = await authClient.post<
    ApiResponse<UploadDocumentResponse>
  >(
    "/FileUploader/UploadDocument",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}

/**
 * --------------------------------------------------------------------------
 * Verify BVN
 * --------------------------------------------------------------------------
 */
export async function verifyBVN(
  bvn: string
) {
  const { data } = await authClient.get<
    ApiResponse<BVNDetails>
  >(
    "/Validator/GetBVNDetails",
    {
      params: {
        BVN: bvn,
      },
    }
  );

  return data;
}

/**
 * --------------------------------------------------------------------------
 * Get Business Details
 * --------------------------------------------------------------------------
 */
export async function getBusinessDetails(
  rcNumber: string
) {
  const { data } = await authClient.get<
    ApiResponse<BusinessVerification>
  >(
    "/Validator/GetBusinessDetails",
    {
      params: {
        RegistrationNumber: rcNumber,
      },
    }
  );

  return data;
}