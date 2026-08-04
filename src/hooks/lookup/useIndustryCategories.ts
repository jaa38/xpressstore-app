import { useQuery } from "@tanstack/react-query";

import { lookupService } from "@/services/lookup/lookupService";

interface Props {
  industryId: number;
}

export function useIndustryCategories({ industryId }: Props) {
  const query = useQuery({
    queryKey: ["industry-categories", industryId],

    queryFn: () => lookupService.getIndustryCategories(industryId),

    enabled: industryId > 0,
  });

  return {
    industryCategories: query.data?.data ?? [],

    isLoading: query.isLoading,

    error: query.error,

    refetch: query.refetch,
  };
}
