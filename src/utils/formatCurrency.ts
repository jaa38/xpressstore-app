import type { Currency } from "@/types/currency";

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

export function getCurrencySymbol(currency: Currency) {
  return CURRENCY_SYMBOLS[currency];
}

export function formatCurrency(
  amount: number,
  currency?: Currency
) {
  return `${getCurrencySymbol(currency ?? "NGN")}${amount.toLocaleString()}`;
}