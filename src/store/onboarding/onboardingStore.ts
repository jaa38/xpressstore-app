import { create } from "zustand";

import {
  BVNDetails,
  BusinessVerification,
  MerchantKyc,
  UploadDocumentResponse,
} from "@/types/kyc";

interface OnboardingStore {
  /**
   * ---------------------------------------------------------------------------
   * Merchant
   * ---------------------------------------------------------------------------
   */
  merchantId: string | null;

  kycTierId: string | null;

  /**
   * ---------------------------------------------------------------------------
   * Identity Verification
   * ---------------------------------------------------------------------------
   */
  bvn: string | null;

  verifiedBVN: BVNDetails | null;

  verifiedBusiness: BusinessVerification | null;

  /**
   * ---------------------------------------------------------------------------
   * Document Upload
   * ---------------------------------------------------------------------------
   */
  uploadedDocument: UploadDocumentResponse | null;

  /**
   * ---------------------------------------------------------------------------
   * Merchant KYC
   * ---------------------------------------------------------------------------
   */
  merchantKyc: MerchantKyc | null;

  /**
   * ---------------------------------------------------------------------------
   * Actions
   * ---------------------------------------------------------------------------
   */
  setMerchantId: (merchantId: string) => void;

  setKycTierId: (kycTierId: string) => void;

  setBVN: (bvn: string) => void;

  setVerifiedBVN: (details: BVNDetails) => void;

  setVerifiedBusiness: (
    business: BusinessVerification
  ) => void;

  setUploadedDocument: (
    document: UploadDocumentResponse
  ) => void;

  setMerchantKyc: (
    merchantKyc: MerchantKyc
  ) => void;

  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  /**
   * ---------------------------------------------------------------------------
   * Initial State
   * ---------------------------------------------------------------------------
   */
  merchantId: null,

  kycTierId: null,

  bvn: null,

  verifiedBVN: null,

  verifiedBusiness: null,

  uploadedDocument: null,

  merchantKyc: null,

  /**
   * ---------------------------------------------------------------------------
   * Merchant
   * ---------------------------------------------------------------------------
   */
  setMerchantId: (merchantId) =>
    set({
      merchantId,
    }),

  setKycTierId: (kycTierId) =>
    set({
      kycTierId,
    }),

  /**
   * ---------------------------------------------------------------------------
   * Identity
   * ---------------------------------------------------------------------------
   */
  setBVN: (bvn) =>
    set({
      bvn,
    }),

  setVerifiedBVN: (verifiedBVN) =>
    set({
      verifiedBVN,
    }),

  setVerifiedBusiness: (verifiedBusiness) =>
    set({
      verifiedBusiness,
    }),

  /**
   * ---------------------------------------------------------------------------
   * Documents
   * ---------------------------------------------------------------------------
   */
  setUploadedDocument: (uploadedDocument) =>
    set({
      uploadedDocument,
    }),

  /**
   * ---------------------------------------------------------------------------
   * Merchant KYC
   * ---------------------------------------------------------------------------
   */
  setMerchantKyc: (merchantKyc) =>
    set({
      merchantKyc,
    }),

  /**
   * ---------------------------------------------------------------------------
   * Reset
   * ---------------------------------------------------------------------------
   */
  reset: () =>
    set({
      merchantId: null,

      kycTierId: null,

      bvn: null,

      verifiedBVN: null,

      verifiedBusiness: null,

      uploadedDocument: null,

      merchantKyc: null,
    }),
}));