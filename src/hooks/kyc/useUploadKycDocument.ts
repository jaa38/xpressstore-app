import { useMutation } from "@tanstack/react-query";

import { kycService } from "@/services/kyc/kycService";

import type { ApiResponse } from "@/types/api";

import type { UploadDocumentResponse } from "@/types/kyc";

export function useUploadKycDocument() {
  return useMutation<ApiResponse<UploadDocumentResponse>, Error, FormData>({
    mutationFn: (payload) => kycService.uploadDocument(payload),
  });
}
