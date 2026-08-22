import { useInfiniteQuery } from "@tanstack/react-query";

import { USE_MOCK_ORDERS } from "@/mocks/config";
import { getMockOrders } from "@/mocks/orders";

import { getOrdersPage } from "@/services/order/order-service";

import { queryKeys } from "@/lib/queryKeys";

import type { Order } from "@/types/order";

const PAGE_SIZE = 20;

interface OrdersPage {
  orders: Order[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export function useOrders() {
  return useInfiniteQuery<OrdersPage>({
    queryKey: queryKeys.orders,

    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const page = Number(pageParam);

      if (USE_MOCK_ORDERS) {
        const orders = getMockOrders();

        const startIndex = (page - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;

        return {
          orders: orders.slice(startIndex, endIndex),
          totalCount: orders.length,
          pageNumber: page,
          pageSize: PAGE_SIZE,
        };
      }

      return getOrdersPage(page, PAGE_SIZE);
    },

    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.pageNumber + 1;

      const totalPages = Math.ceil(lastPage.totalCount / lastPage.pageSize);

      return nextPage <= totalPages ? nextPage : undefined;
    },
  });
}
