import { useMutation } from "@tanstack/react-query";

import { merchantService } from "@/services/merchant/merchantService";

import { UpdateBusinessDetailsRequest } from "@/types/merchant";

export function useUpdateBusinessDetails() {
  return useMutation({
    mutationFn: (payload: UpdateBusinessDetailsRequest) =>
      merchantService.updateBusinessDetails(payload),
  });
}
