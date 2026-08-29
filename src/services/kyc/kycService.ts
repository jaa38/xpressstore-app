import { authClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

import type { ApiResponse } from "@/types/api";

import type {
  BusinessVerificationRequest,
  BusinessVerification,
  BVNDetails,
  MerchantKyc,
  MerchantKycRequest,
  UploadDocumentResponse,
  VerifyBVNRequest,
  KycTier,
  KycRequirement,
} from "@/types/kyc";

import {
  USE_MOCK_BVN,
  USE_MOCK_KYC,
  USE_MOCK_DOCUMENT_UPLOAD,
  verifyMockBVN,
  getMockKycTiers,
  getMockKycRequirements,
  uploadMockDocument,
  createMockMerchantKyc,
} from "@/mocks";

export const kycService = {
  /**
   * ---------------------------------------------------------------------------
   * Verify BVN
   * ---------------------------------------------------------------------------
   */

  async verifyBVN(payload: VerifyBVNRequest) {
    if (USE_MOCK_BVN) {
      return {
        responseCode: "00",
        responseMessage: "BVN verified successfully",
        data: verifyMockBVN(payload.bvn),
      };
    }

    const { data } = await authClient.get<ApiResponse<BVNDetails>>(
      API_ENDPOINTS.kyc.verifyBVN,
      {
        params: {
          BVN: payload.bvn,
        },
      }
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Verify Business
   * ---------------------------------------------------------------------------
   */
  async verifyBusiness(payload: BusinessVerificationRequest) {
    const { data } = await authClient.get<ApiResponse<BusinessVerification>>(
      API_ENDPOINTS.kyc.businessDetails,
      {
        params: {
          RegistrationNumber: payload.rcNumber,
        },
      }
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Upload Document
   * ---------------------------------------------------------------------------
   */

  async uploadDocument(payload: FormData) {
    if (USE_MOCK_DOCUMENT_UPLOAD) {
      const file = payload.get("file") as {
        name?: string;
      } | null;

      const filename = file?.name ?? "mock-document.pdf";

      return {
        responseCode: "00",
        responseMessage: "Document uploaded successfully",
        data: uploadMockDocument(filename),
      };
    }

    const { data } = await authClient.post<ApiResponse<UploadDocumentResponse>>(
      API_ENDPOINTS.kyc.uploadDocument,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Create Merchant KYC
   * ---------------------------------------------------------------------------
   */

  async createMerchantKyc(payload: MerchantKycRequest) {
    if (USE_MOCK_KYC) {
      return {
        responseCode: "00",
        responseMessage: "Merchant KYC created successfully",
        data: createMockMerchantKyc(payload),
      };
    }

    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.kyc.createStorefront,
      payload
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Merchant KYC
   * ---------------------------------------------------------------------------
   */
  async getMerchantKyc(merchantId: string) {
    const { data } = await authClient.get<ApiResponse<MerchantKyc[]>>(
      API_ENDPOINTS.kyc.merchant,
      {
        params: {
          merchantId,
        },
      }
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Get KYC Tiers
   * ---------------------------------------------------------------------------
   */

  async getKycTiers() {
    if (USE_MOCK_KYC) {
      return {
        responseCode: "00",
        responseMessage: "KYC tiers retrieved successfully",
        data: getMockKycTiers(),
      };
    }

    const { data } = await authClient.get<ApiResponse<KycTier[]>>(
      API_ENDPOINTS.kyc.tiers
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Get KYC Requirements
   * ---------------------------------------------------------------------------
   */

  async getKycRequirements(kycTierId: number) {
    if (USE_MOCK_KYC) {
      return {
        responseCode: "00",
        responseMessage: "KYC requirements retrieved successfully",
        data: getMockKycRequirements(kycTierId),
      };
    }

    const { data } = await authClient.get<ApiResponse<KycRequirement[]>>(
      API_ENDPOINTS.kyc.requirements,
      {
        params: {
          KycTierId: kycTierId,
        },
      }
    );

    return data;
  },
};
