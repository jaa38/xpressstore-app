import { useQuery } from "@tanstack/react-query";

import { lookupService } from "@/services/lookup/lookupService";

import type { BusinessCategory } from "@/types/lookup";

export function useBusinessCategories() {
  const query = useQuery({
    queryKey: ["business-categories"],

    queryFn: () => lookupService.getBusinessCategories(),
  });

  const categories: BusinessCategory[] =
    query.data?.data ?? [];

  return {
    categories,

    isLoading: query.isLoading,

    error: query.error,

    refetch: query.refetch,
  };
}