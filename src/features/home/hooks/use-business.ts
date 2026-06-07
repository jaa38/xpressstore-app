import { useQuery } from "@tanstack/react-query";

import { getBusiness } from "../api/home-api";

export function useBusiness() {
  const query = useQuery({
    queryKey: ["business"],
    queryFn: getBusiness,
  });

  return {
    business: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
