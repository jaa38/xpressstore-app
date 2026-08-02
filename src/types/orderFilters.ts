import type { AmountRange, DateRange } from "@/types/filters";

export type OrderSort = "mostRecent" | "amountHighToLow" | "amountLowToHigh";

export interface OrderFilters {
  amount: AmountRange;

  date: DateRange;

  sort: OrderSort;
}
