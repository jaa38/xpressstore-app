import { authClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

import { ApiResponse } from "@/types/api";

import {
  BusinessVerificationRequest,
  BusinessVerification,
  BVNDetails,
  MerchantKyc,
  MerchantKycRequest,
  UploadDocumentResponse,
  VerifyBVNRequest,
} from "@/types/kyc";

export const kycService = {
  /**
   * ---------------------------------------------------------------------------
   * Verify BVN
   * ---------------------------------------------------------------------------
   */
  async verifyBVN(payload: VerifyBVNRequest) {
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
};
