export interface AmountRange {
  min: number;
  max: number;
}

export type OrderSort =
  | "newest"
  | "oldest"
  | "highestAmount"
  | "lowestAmount";

export interface OrderFilters {
  amount: AmountRange;
  date?: {
    start?: Date;
    end?: Date;
  };
  sort: OrderSort;
}