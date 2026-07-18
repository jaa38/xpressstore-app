export interface AmountRange {
  min: number;
  max: number;
}

export interface DateRange {
  start?: Date;
  end?: Date;
}

export type OrderSort =
  | "newest"
  | "oldest"
  | "highestAmount"
  | "lowestAmount";

export interface OrderFilters {
  amount: AmountRange;
  date: DateRange;
  sort: OrderSort;
}