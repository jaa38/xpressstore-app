import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { getCustomerById } from "@/services/customer/customer-service";

export function useCustomerById(id: string) {
  return useQuery({
    queryKey: queryKeys.customer(id),

    queryFn: () => getCustomerById(id),

    enabled: Boolean(id),
  });
}