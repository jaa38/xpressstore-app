import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeService } from "@/services/store/storeService";

export function useCreateShippingRegion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeService.createShippingRegion,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shipping-regions"],
      });
    },
  });
}