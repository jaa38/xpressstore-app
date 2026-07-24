import { Currency } from "@/types/currency";

export type CurrencyOption = {
  label: string;
  value: Currency;
};

export const CURRENCIES: CurrencyOption[] = [
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