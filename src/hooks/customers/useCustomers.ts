import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { getCustomers } from "@/services/customer-service";

export function useCustomers() {
  return useQuery({
    queryKey: queryKeys.customers,
    queryFn: getCustomers,
  });
}