import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

export function useDeleteShippingRegion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeService.deleteShippingRegion,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shipping-regions"],
      });
    },
  });
}
