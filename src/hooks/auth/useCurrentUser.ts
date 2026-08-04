import { useQuery } from "@tanstack/react-query";

import { authService } from "@/services/auth/authService";

import { getAccessToken } from "@/storage/authStorage";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],

    queryFn: async () => {
      const token =
        await getAccessToken();

      if (!token) {
        return null;
      }

      const response =
        await authService.getCurrentUser(
          token
        );

      return response.data;
    },
  });
}