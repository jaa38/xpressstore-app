import { useQuery } from "@tanstack/react-query";

import { merchantService } from "@/services/merchant/merchantService";

export function useProfile() {
  const query = useQuery({
    queryKey: ["profile"],

    queryFn: merchantService.getProfile,
  });

  return {
    profile: query.data?.data,

    isLoading: query.isLoading,

    error: query.error,

    refetch: query.refetch,
  };
}