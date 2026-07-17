import type { Currency } from "@/types/currency";

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

export function getCurrencySymbol(
  currency: Currency = "NGN"
) {
  return CURRENCY_SYMBOLS[currency];
}

interface FormatCurrencyOptions {
  currency?: Currency;
  showDecimals?: boolean;
}

export function formatCurrency(
  amount: number,
  {
    currency = "NGN",
    showDecimals = false,
  }: FormatCurrencyOptions = {}
) {
  return `${getCurrencySymbol(currency)}${amount.toLocaleString(
    undefined,
    {
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }
  )}`;
}