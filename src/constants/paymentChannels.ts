import type { Ionicons } from "@expo/vector-icons";
import type { PaymentChannel } from "@/types/payment";

export const PAYMENT_CHANNELS: Record<
  PaymentChannel,
  {
    label: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
  }
> = {
  card: {
    label: "Card",
    icon: "card-outline",
  },
  bank: {
    label: "Bank",
    icon: "business-outline",
  },
  bankTransfer: {
    label: "Bank Transfer",
    icon: "swap-horizontal-outline",
  },
  nqr: {
    label: "NQR",
    icon: "qr-code-outline",
  },
  ussd: {
    label: "USSD",
    icon: "call-outline",
  },
};
