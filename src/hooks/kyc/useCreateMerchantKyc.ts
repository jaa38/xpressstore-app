import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { kycService } from "@/services/kyc/kycService";

import { queryKeys } from "@/lib/queryKeys";

export function useCreateMerchantKyc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: kycService.createMerchantKyc,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.merchantKycs,
      });
    },
  });
}