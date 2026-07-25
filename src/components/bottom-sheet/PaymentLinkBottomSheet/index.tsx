import { forwardRef, useMemo } from "react";
import { Alert, Share, View } from "react-native";

import * as Clipboard from "expo-clipboard";

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { ListActionItem } from "@/components/ui/ListActionItem";

import { spacing } from "@/theme";

import type { PaymentLink } from "@/types/paymentLink";

interface PaymentLinkBottomSheetProps {
  paymentLink: PaymentLink | null;

  onViewQRCode?: (paymentLink: PaymentLink) => void;

  onDeactivateLink?: (paymentLink: PaymentLink) => void;

  onDeleteLink?: (paymentLink: PaymentLink) => void;
}

export const PaymentLinkBottomSheet = forwardRef<
  BottomSheetModal,
  PaymentLinkBottomSheetProps
>(({ paymentLink, onViewQRCode, onDeactivateLink, onDeleteLink }, ref) => {
  const snapPoints = useMemo(() => ["70%"], []);

  const dismissSheet = () => {
    (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
  };

  const handleCopyLink = async () => {
    if (!paymentLink) return;

    await Clipboard.setStringAsync(paymentLink.url);

    Alert.alert("Link Copied", "Payment link copied to clipboard.");
  };

  const handleShareLink = async () => {
    if (!paymentLink) return;

    try {
      await Share.share({
        title: paymentLink.title,
        message: `${paymentLink.title}\n\n${paymentLink.url}`,
        url: paymentLink.url,
      });
    } catch {
      Alert.alert(
        "Unable to Share",
        "Something went wrong while trying to share the payment link."
      );
    }
  };

  const handleViewQRCode = () => {
    if (!paymentLink) return;

    dismissSheet();

    onViewQRCode?.(paymentLink);
  };

  const handleDeactivateLink = () => {
    if (!paymentLink) return;

    dismissSheet();

    onDeactivateLink?.(paymentLink);
  };

  const handleDeleteLink = () => {
    if (!paymentLink) return;

    dismissSheet();

    onDeleteLink?.(paymentLink);
  };

  return (
    <BottomSheetModal ref={ref} snapPoints={snapPoints}>
      <BottomSheetView
        style={{
          flex: 1,
          padding: spacing.lg,
          justifyContent: "space-between",
        }}
      >
        <View>
          <View
            style={{
              gap: spacing.xs,
              marginBottom: spacing.lg,
            }}
          >
            <AppText variant="h2">Payment Link</AppText>

            <AppText variant="bodyBold">{paymentLink?.title}</AppText>

            <AppText color="secondary">{paymentLink?.url}</AppText>
          </View>

          <Divider />

          <ListActionItem
            icon="copy-outline"
            title="Copy Link"
            onPress={handleCopyLink}
          />

          <Divider />

          <ListActionItem
            icon="share-social-outline"
            title="Share Link"
            onPress={handleShareLink}
          />

          <Divider />

          <ListActionItem
            icon="qr-code-outline"
            title="View QR Code"
            onPress={handleViewQRCode}
          />

          <Divider />

          <ListActionItem
            icon="pause-circle-outline"
            title="Deactivate Link"
            onPress={handleDeactivateLink}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

PaymentLinkBottomSheet.displayName = "PaymentLinkBottomSheet";
