import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeService } from "@/services/store/storeService";

export function useUpdateShippingRegion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeService.updateShippingRegion,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shipping-regions"],
      });
    },
  });
}