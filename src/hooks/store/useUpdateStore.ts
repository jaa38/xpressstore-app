import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeService } from "@/services/store/storeService";

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeService.updateStore,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stores"],
      });

      queryClient.invalidateQueries({
        queryKey: ["store"],
      });
    },
  });
}