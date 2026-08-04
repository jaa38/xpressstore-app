import { useMutation } from "@tanstack/react-query";

import { businessService } from "@/services/business/businessService";

import { CreateBusinessRequest } from "@/types/business";

export function useCreateBusiness() {
  return useMutation({
    mutationFn: (
      payload: CreateBusinessRequest
    ) =>
      businessService.create(
        payload
      ),
  });
}