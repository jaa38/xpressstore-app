import { forwardRef, useMemo } from "react";
import { View } from "react-native";

import {
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { AppText } from "@/components/ui/AppText";
import { Divider } from "@/components/ui/Divider";

import { spacing } from "@/theme";

import type { PaymentLink } from "@/types/paymentLink";

import { PaymentLinkActionItem } from "../PaymentLinkActionItem";

interface PaymentLinkBottomSheetProps {
  paymentLink: PaymentLink | null;
}

export const PaymentLinkBottomSheet = forwardRef<
  BottomSheetModal,
  PaymentLinkBottomSheetProps
>(({ paymentLink }, ref) => {
  const snapPoints = useMemo(() => ["70%"], []);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
    >
      <BottomSheetView
        style={{
          flex: 1,
          padding: spacing.lg,
        }}
      >
        <View
          style={{
            gap: spacing.xs,
            marginBottom: spacing.lg,
          }}
        >
          <AppText variant="h2">
            Payment Link
          </AppText>

          <AppText variant="bodyBold">
            {paymentLink?.title}
          </AppText>

          <AppText color="secondary">
            {paymentLink?.url}
          </AppText>
        </View>

        <Divider />

        <PaymentLinkActionItem
          icon="eye-outline"
          title="View Details"
          onPress={() => {}}
        />

        <Divider />

        <PaymentLinkActionItem
          icon="copy-outline"
          title="Copy Link"
          onPress={() => {}}
        />

        <Divider />

        <PaymentLinkActionItem
          icon="share-social-outline"
          title="Share Link"
          onPress={() => {}}
        />

        <Divider />

        <PaymentLinkActionItem
          icon="create-outline"
          title="Edit Link"
          onPress={() => {}}
        />

        <Divider />

        <PaymentLinkActionItem
          icon="qr-code-outline"
          title="View QR Code"
          onPress={() => {}}
        />

        <Divider />

        <PaymentLinkActionItem
          icon="pause-circle-outline"
          title="Deactivate Link"
          onPress={() => {}}
        />

        <Divider />

        <PaymentLinkActionItem
          icon="trash-outline"
          title="Delete Link"
          destructive
          onPress={() => {}}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

PaymentLinkBottomSheet.displayName =
  "PaymentLinkBottomSheet";