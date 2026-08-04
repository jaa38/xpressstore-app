import { useMutation } from "@tanstack/react-query";

import { kycService } from "@/services/kyc/kycService";

export function useUploadDocument() {
  return useMutation({
    mutationFn: kycService.uploadDocument,
  });
}
