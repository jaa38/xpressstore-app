import { useQuery } from "@tanstack/react-query";

import { merchantService } from "@/services/merchant/merchantService";

export function useSettlementAccounts() {
  const query = useQuery({
    queryKey: ["settlement-accounts"],

    queryFn: merchantService.getSettlementAccounts,
  });

  return {
    settlementAccounts: query.data?.data,

    isLoading: query.isLoading,

    error: query.error,

    refetch: query.refetch,
  };
}