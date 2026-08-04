import { useQuery } from "@tanstack/react-query";

import { lookupService } from "@/services/lookup/lookupService";

export function useBusinessCategories() {
  const query = useQuery({
    queryKey: ["business-categories"],

    queryFn: () => lookupService.getBusinessCategories(),
  });

  return {
    categories: query.data?.data ?? [],

    isLoading: query.isLoading,

    error: query.error,

    refetch: query.refetch,
  };
}
