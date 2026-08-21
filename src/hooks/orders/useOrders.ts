// src/hooks/orders/useOrders.ts

import { useInfiniteQuery } from "@tanstack/react-query";

import { USE_MOCK_ORDERS } from "@/mocks/config";
import { getMockOrders } from "@/mocks/orders";

import type { Order } from "@/types/order";

interface OrdersPage {
  orders: Order[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

const PAGE_SIZE = 10;

/**
 * ============================================================================
 * USE ORDERS
 * ============================================================================
 */

export function useOrders() {
  return useInfiniteQuery<OrdersPage>({
    queryKey: ["orders"],

    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const page = Number(pageParam);

      /**
       * -----------------------------------------------------------------------
       * MOCK MODE
       * -----------------------------------------------------------------------
       */

      if (USE_MOCK_ORDERS) {
        const orders = getMockOrders();

        const startIndex = (page - 1) * PAGE_SIZE;

        const endIndex = startIndex + PAGE_SIZE;

        const paginatedOrders = orders.slice(startIndex, endIndex);

        return {
          orders: paginatedOrders,

          pageNumber: page,

          pageSize: PAGE_SIZE,

          totalCount: orders.length,
        };
      }

      /**
       * -----------------------------------------------------------------------
       * API MODE
       * -----------------------------------------------------------------------
       *
       * Connect your real Orders API here.
       */

      throw new Error("Orders API is not implemented yet.");
    },

    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.totalCount / lastPage.pageSize);

      const nextPage = lastPage.pageNumber + 1;

      return nextPage <= totalPages ? nextPage : undefined;
    },
  });
}
