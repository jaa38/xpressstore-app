import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCategory } from "@/services/category/category-service";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
}