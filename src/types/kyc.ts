export interface VerifyBVNRequest {
  bvn: string;
}

export interface BVNDetails {
  bvn: string;

  firstName: string;

  lastName: string;

  dateOfBirth: string;

  phoneNumber: string;
}

export interface BusinessVerificationRequest {
  rcNumber: string;
}

export interface BusinessVerification {
  companyName: string;

  rcNumber: string;

  registrationDate: string;

  status: string;
}

export interface MerchantKycRequest {
  merchantId: string;

  kycTierId: string;

  documentType: string;

  documentUrl: string;

  bvn?: string;
}

export interface UploadDocumentResponse {
  filename: string;

  url: string;
}

export interface MerchantKyc {
  merchantKycId: number;

  merchantId: number;

  kycTierId: number;

  status: string;

  remarks?: string;

  createdAt: string;

  updatedAt?: string;
}
