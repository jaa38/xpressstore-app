import { useQuery } from "@tanstack/react-query";

import { getCustomerById } from "@/services/customer/customer-service";

export function useCustomerById(id: string) {
  return useQuery({
    queryKey: ["customers", id],

    queryFn: () => getCustomerById(id),

    enabled: !!id,
  });
}
