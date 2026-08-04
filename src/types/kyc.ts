export interface VerifyBVNRequest {
  bvn: string;
}

export interface BVNDetails {
  firstName: string;

  lastName: string;

  middleName?: string;

  dateOfBirth: string;

  phoneNumber: string;
}

export interface BusinessVerificationRequest {
  rcNumber: string;
}

export interface BusinessVerification {
  businessName: string;

  rcNumber: string;

  registrationDate: string;

  status: string;
}

export interface MerchantKycRequest {
  kycTierId: number;

  documentType: string;

  documentNumber: string;

  documentUrl: string;
}

export interface UploadDocumentResponse {
  fileName: string;

  fileUrl: string;
}