import type { OrderFilters } from "@/types/orderFilters";

export const defaultOrderFilters: OrderFilters = {
  amount: {
    min: undefined,
    max: undefined,
  },

  date: {
    start: undefined,
    end: undefined,
  },

  sort: "mostRecent",
};