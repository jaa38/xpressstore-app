export interface AmountRange {
  min?: number;
  max?: number;
}

export interface DateRange {
  start?: Date;
  end?: Date;
}

export type OrderSort = "mostRecent" | "amountHighToLow" | "amountLowToHigh";

export interface OrderFilters {
  amount: AmountRange;

  date: DateRange;

  sort: OrderSort;
}
