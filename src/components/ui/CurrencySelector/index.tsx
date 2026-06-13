import { Dropdown } from "@/components/ui/Dropdown";

const CURRENCIES = [
  {
    label: "₦",
    value: "NGN",
  },
  {
    label: "$",
    value: "USD",
  },
  {
    label: "£",
    value: "GBP",
  },
  {
    label: "€",
    value: "EUR",
  },
];

interface CurrencySelectorProps {
  value: string;

  onSelect: (value: string) => void;
}

export function CurrencySelector({
  value,
  onSelect,
}: CurrencySelectorProps) {
  return (
    <Dropdown
      value={value}
      options={CURRENCIES}
      onSelect={onSelect}
    />
  );
}