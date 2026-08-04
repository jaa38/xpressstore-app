import { useQuery } from "@tanstack/react-query";

import { getProfile } from "../../../api/home/profile-api";

import { useAuth } from "@/providers/AuthProvider";

export function useProfile() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["profile"],

    queryFn: getProfile,

    enabled: !!user,
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}