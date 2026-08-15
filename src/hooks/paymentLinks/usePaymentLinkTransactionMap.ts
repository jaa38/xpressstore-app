import { useQueries } from "@tanstack/react-query";

import { paymentLinkService } from "@/services/payment-links/paymentLinkService";
import { queryKeys } from "@/lib/queryKeys";

import type { PaymentLink, PaymentLinkTransaction } from "@/types/paymentLink";

export function usePaymentLinkTransactionMap(paymentLinks: PaymentLink[]) {
  const queries = useQueries({
    queries: paymentLinks.map((paymentLink) => ({
      queryKey: queryKeys.paymentLinkTransactions(paymentLink.id),

      queryFn: () =>
        paymentLinkService.getPaymentLinkTransactions(paymentLink.id),

      enabled: paymentLink.id > 0,
    })),
  });

  const transactionsByPaymentLinkId = new Map<
    number,
    PaymentLinkTransaction[]
  >();

  paymentLinks.forEach((paymentLink, index) => {
    const query = queries[index];

    transactionsByPaymentLinkId.set(paymentLink.id, query?.data?.data ?? []);
  });

  /**
   * -------------------------------------------------------------------------
   * Refetch Payment Link Transactions
   * -------------------------------------------------------------------------
   *
   * Refetches the transaction query for every payment link currently
   * displayed on the Payment Links screen.
   */
  async function refetch() {
    await Promise.all(queries.map((query) => query.refetch()));
  }

  return {
    transactionsByPaymentLinkId,

    isLoading: queries.some((query) => query.isLoading),

    isFetching: queries.some((query) => query.isFetching),

    hasError: queries.some((query) => query.isError),

    refetch,

    queries,
  };
}
