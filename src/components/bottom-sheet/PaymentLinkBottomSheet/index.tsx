import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import { Alert, Share, View } from "react-native";

import * as Clipboard from "expo-clipboard";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { radius, spacing, theme } from "@/theme";

import { AppText } from "@/components/ui/AppText";
import { BottomSheetHeader } from "@/components/ui/BottomSheetHeader";
import { BottomSheetSection } from "@/components/ui/BottomSheetSection";
import { Divider } from "@/components/ui/Divider";
import { ListActionItem } from "@/components/ui/ListActionItem";

import type { PaymentLink } from "@/types/paymentLink";

interface PaymentLinkBottomSheetProps {
  paymentLink: PaymentLink | null;

  onViewQRCode?: (paymentLink: PaymentLink) => void;

  onDeactivateLink?: (paymentLink: PaymentLink) => void;
}

export const PaymentLinkBottomSheet = forwardRef<
  BottomSheetModal,
  PaymentLinkBottomSheetProps
>(({ paymentLink, onViewQRCode, onDeactivateLink }, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["65%"], []);

  useImperativeHandle(ref, () => bottomSheetRef.current!, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={0.4}
      />
    ),
    []
  );

  const dismissSheet = () => {
    bottomSheetRef.current?.dismiss();
  };

  async function handleCopyLink() {
    if (!paymentLink) return;

    await Clipboard.setStringAsync(paymentLink.url);

    Alert.alert("Link Copied", "Payment link copied to clipboard.");
  }

  async function handleShareLink() {
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
  }

  function handleQRCode() {
    if (!paymentLink) return;

    dismissSheet();

    onViewQRCode?.(paymentLink);
  }

  function handleDeactivate() {
    if (!paymentLink) return;

    dismissSheet();

    onDeactivateLink?.(paymentLink);
  }

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDismissOnClose
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backgroundStyle={{
        backgroundColor: theme.background.surface,
        borderTopLeftRadius: radius["2xl"],
        borderTopRightRadius: radius["2xl"],
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.border.default,
      }}
    >
      <BottomSheetHeader title="Payment Link" onClose={dismissSheet} />

      <BottomSheetScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.lg,
          paddingBottom: spacing["2xl"],
        }}
      >
        <BottomSheetSection title="Information">
          <View
            style={{
              gap: spacing.xs,
            }}
          >
            <AppText variant="bodyBold">{paymentLink?.title}</AppText>

            <AppText color="secondary">{paymentLink?.url}</AppText>
          </View>
        </BottomSheetSection>

        <BottomSheetSection title="Actions">
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
            onPress={handleQRCode}
          />

          <Divider />

          <ListActionItem
            icon="pause-circle-outline"
            title="Deactivate Link"
            onPress={handleDeactivate}
          />
        </BottomSheetSection>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

PaymentLinkBottomSheet.displayName = "PaymentLinkBottomSheet";
