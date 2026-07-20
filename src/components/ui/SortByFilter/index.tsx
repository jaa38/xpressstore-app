import { RadioGroup, RadioOption } from "@/components/ui/RadioGroup";

import type { OrderSort } from "@/types/orderFilters";

interface SortByFilterProps {
  value: OrderSort;
  onChange: (value: OrderSort) => void;
}

const SORT_OPTIONS: RadioOption[] = [
  {
    label: "Most recent",
    value: "mostRecent",
  },
  {
    label: "Amount: High to Low",
    value: "amountHighToLow",
  },
  {
    label: "Amount: Low to High",
    value: "amountLowToHigh",
  },
];

export function SortByFilter({
  value,
  onChange,
}: SortByFilterProps) {
  return (
    <RadioGroup
      value={value}
      options={SORT_OPTIONS}
      onChange={(value) => onChange(value as OrderSort)}
    />
  );
}