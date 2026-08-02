import type { Ionicons } from "@expo/vector-icons";

export type PaymentChannel =
  | "card"
  | "bank"
  | "bankTransfer"
  | "nqr"
  | "ussd";

export const PAYMENT_CHANNEL_LABELS: Record<
  PaymentChannel,
  string
> = {
  card: "Card",
  bank: "Bank",
  bankTransfer: "Bank Transfer",
  nqr: "NQR",
  ussd: "USSD",
};

export const PAYMENT_CHANNEL_ICONS: Record<
  PaymentChannel,
  React.ComponentProps<typeof Ionicons>["name"]
> = {
  card: "card-outline",
  bank: "business-outline",
  bankTransfer: "swap-horizontal-outline",
  nqr: "qr-code-outline",
  ussd: "call-outline",
};