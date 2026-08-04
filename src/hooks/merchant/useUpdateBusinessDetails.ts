import { useMutation, useQueryClient } from "@tanstack/react-query";

import { merchantService } from "@/services/merchant/merchantService";

export function useUpdateBusinessDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: merchantService.updateBusinessDetails,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["merchant-profile"],
      });
    },
  });
}