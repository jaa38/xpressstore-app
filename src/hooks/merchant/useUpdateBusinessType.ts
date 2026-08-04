import { useMutation } from "@tanstack/react-query";

import { merchantService } from "@/services/merchant/merchantService";

import { UpdateBusinessTypeRequest } from "@/types/merchant";

export function useUpdateBusinessType() {
  return useMutation({
    mutationFn: (
      payload: UpdateBusinessTypeRequest
    ) =>
      merchantService.updateBusinessType(
        payload
      ),
  });
}