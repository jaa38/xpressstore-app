import { useQuery } from "@tanstack/react-query";

import { merchantService } from "@/services/merchant/merchantService";

export function useMerchantProfile() {
  return useQuery({
    queryKey: ["merchant-profile"],

    queryFn: () => merchantService.getProfile(),
  });
}
