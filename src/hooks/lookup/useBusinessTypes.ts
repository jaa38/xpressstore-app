import { useQuery } from "@tanstack/react-query";

import { lookupService } from "@/services/lookup/lookupService";

export function useBusinessTypes() {
  const query = useQuery({
    queryKey: ["business-types"],

    queryFn: () => lookupService.getBusinessTypes(),
  });

  return {
    businessTypes: query.data?.data ?? [],

    isLoading: query.isLoading,

    error: query.error,

    refetch: query.refetch,
  };
}
