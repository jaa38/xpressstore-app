import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeService } from "@/services/store/storeService";

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
