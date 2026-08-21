import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeService.createStore,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stores"],
      });
    },
  });
}
