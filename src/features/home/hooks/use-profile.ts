import { useQuery } from "@tanstack/react-query";

import { getProfile } from "../api/profile-api";

import { useAuthStore } from "@/features/auth/store/auth-store";

export function useProfile() {
  const user = useAuthStore((state) => state.user);

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
