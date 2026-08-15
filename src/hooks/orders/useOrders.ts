import { useInfiniteQuery } from "@tanstack/react-query";

import { getOrdersPage } from "@/services/order/order-service";

import { queryKeys } from "@/lib/queryKeys";

import { queryWithCache } from "@/database/query";

const ORDERS_PAGE_SIZE = 20;

const ORDERS_CACHE_MAX_AGE = 1000 * 60 * 30;

export function useOrders() {
  return useInfiniteQuery({
    queryKey: queryKeys.orders,

    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      queryWithCache(
        queryKeys.ordersPage(pageParam, ORDERS_PAGE_SIZE),
        () => getOrdersPage(pageParam, ORDERS_PAGE_SIZE),
        {
          maxAge: ORDERS_CACHE_MAX_AGE,
        }
      ),

    getNextPageParam: (lastPage) => {
      const loadedCount = lastPage.pageNumber * lastPage.pageSize;

      if (loadedCount >= lastPage.totalCount) {
        return undefined;
      }

      return lastPage.pageNumber + 1;
    },
  });
}
