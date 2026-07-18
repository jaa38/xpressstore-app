import { Dropdown, DropdownOption } from "@/components/ui/Dropdown";

import type { OrderSort } from "@/types/orderFilters";

interface SortByFilterProps {
  value: OrderSort;

  onChange: (value: OrderSort) => void;
}

const SORT_OPTIONS: DropdownOption[] = [
  {
    label: "Most recent",
    value: "mostRecent",
  },
  {
    label: "Amount: high to low",
    value: "amountHighToLow",
  },
  {
    label: "Amount: low to high",
    value: "amountLowToHigh",
  },
];

export function SortByFilter({
  value,
  onChange,
}: SortByFilterProps) {
  return (
    <Dropdown
      placeholder="Select sorting"
      value={value}
      options={SORT_OPTIONS}
      onSelect={(value) =>
        onChange(value as OrderSort)
      }
    />
  );
}