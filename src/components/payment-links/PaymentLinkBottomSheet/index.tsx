import { forwardRef, useMemo } from "react";
import { View } from "react-native";

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

import { AppText } from "@/components/ui/AppText";

import { spacing } from "@/theme";

import type { PaymentLink } from "@/types/paymentLink";

interface PaymentLinkBottomSheetProps {
  paymentLink: PaymentLink | null;
}

export const PaymentLinkBottomSheet = forwardRef<
  BottomSheetModal,
  PaymentLinkBottomSheetProps
>(({ paymentLink }, ref) => {
  const snapPoints = useMemo(() => ["35%"], []);

  return (
    <BottomSheetModal ref={ref} snapPoints={snapPoints}>
      <BottomSheetView
        style={{
          flex: 1,
          padding: spacing.lg,
          gap: spacing.md,
        }}
      >
        <AppText variant="h2">Payment Link</AppText>

        <AppText variant="body">{paymentLink?.title}</AppText>

        <AppText color="secondary">{paymentLink?.url}</AppText>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

PaymentLinkBottomSheet.displayName = "PaymentLinkBottomSheet";
