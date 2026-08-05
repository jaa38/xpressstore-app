import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeService } from "@/services/store/storeService";

export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeService.deleteStore,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stores"],
      });
    },
  });
}