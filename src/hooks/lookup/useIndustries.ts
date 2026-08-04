import { useQuery } from "@tanstack/react-query";

import { lookupService } from "@/services/lookup/lookupService";

export function useIndustries() {
  const query = useQuery({
    queryKey: ["industries"],

    queryFn: () =>
      lookupService.getIndustries(),
  });

  return {
    industries: query.data?.data ?? [],

    isLoading: query.isLoading,

    error: query.error,

    refetch: query.refetch,
  };
}