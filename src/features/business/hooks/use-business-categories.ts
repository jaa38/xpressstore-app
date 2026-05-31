import { useQuery } from "@tanstack/react-query";

import { getBusinessCategories } from "../api/business-api";

export function useBusinessCategories() {
  const query = useQuery({
    queryKey: ["business-categories"],
    queryFn: getBusinessCategories,
  });

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}