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

import { BottomSheetHeader } from "@/components/ui/BottomSheetHeader";
import { BottomSheetSection } from "@/components/ui/BottomSheetSection";
import { Divider } from "@/components/ui/Divider";
import { ListActionItem } from "@/components/ui/ListActionItem";
import { AppText } from "@/components/ui/AppText";

import { radius, spacing, theme } from "@/theme";

import type { PaymentLink } from "@/types/paymentLink";

interface PaymentLinkBottomSheetProps {
  paymentLink: PaymentLink | null;

  onViewQRCode?: (paymentLink: PaymentLink) => void;

  onDeactivateLink?: (paymentLink: PaymentLink) => void;
}

/**
 * ---------------------------------------------------------------------------
 * PAYMENT LINK URL
 * ---------------------------------------------------------------------------
 */

function getPaymentLinkUrl(paymentLink: PaymentLink) {
  return (
    paymentLink.paymentLink ||
    `https://payx.press/${paymentLink.paymentLinkReference}`
  );
}

/**
 * ---------------------------------------------------------------------------
 * PAYMENT LINK BOTTOM SHEET
 * ---------------------------------------------------------------------------
 */

export const PaymentLinkBottomSheet = forwardRef<
  BottomSheetModal,
  PaymentLinkBottomSheetProps
>(({ paymentLink, onViewQRCode, onDeactivateLink }, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["65%"], []);

  /**
   * -----------------------------------------------------------------------
   * EXPOSE REF
   * -----------------------------------------------------------------------
   */

  useImperativeHandle(ref, () => bottomSheetRef.current!, []);

  /**
   * -----------------------------------------------------------------------
   * BACKDROP
   * -----------------------------------------------------------------------
   */

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={0.4}
        enableTouchThrough={false}
      />
    ),
    []
  );

  /**
   * -----------------------------------------------------------------------
   * DISMISS
   * -----------------------------------------------------------------------
   */

  const dismissSheet = () => {
    bottomSheetRef.current?.dismiss();
  };

  /**
   * -----------------------------------------------------------------------
   * COPY LINK
   * -----------------------------------------------------------------------
   */

  const handleCopyLink = async () => {
    if (!paymentLink) {
      return;
    }

    const paymentLinkUrl = getPaymentLinkUrl(paymentLink);

    try {
      await Clipboard.setStringAsync(paymentLinkUrl);

      Alert.alert("Link Copied", "Payment link copied to clipboard.");
    } catch {
      Alert.alert(
        "Unable to Copy",
        "Something went wrong while copying the payment link."
      );
    }
  };

  /**
   * -----------------------------------------------------------------------
   * SHARE LINK
   * -----------------------------------------------------------------------
   */

  const handleShareLink = async () => {
    if (!paymentLink) {
      return;
    }

    const paymentLinkUrl = getPaymentLinkUrl(paymentLink);

    try {
      await Share.share({
        title: paymentLink.name,
        message: `${paymentLink.name}\n\n${paymentLinkUrl}`,
        url: paymentLinkUrl,
      });
    } catch {
      Alert.alert(
        "Unable to Share",
        "Something went wrong while trying to share the payment link."
      );
    }
  };

  /**
   * -----------------------------------------------------------------------
   * VIEW QR CODE
   * -----------------------------------------------------------------------
   */

  const handleQRCode = () => {
    if (!paymentLink) {
      return;
    }

    dismissSheet();

    onViewQRCode?.(paymentLink);
  };

  /**
   * -----------------------------------------------------------------------
   * DEACTIVATE
   * -----------------------------------------------------------------------
   */

  const handleDeactivate = () => {
    if (!paymentLink) {
      return;
    }

    dismissSheet();

    onDeactivateLink?.(paymentLink);
  };

  /**
   * -----------------------------------------------------------------------
   * RENDER
   * -----------------------------------------------------------------------
   */

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
      {/* HEADER */}

      <BottomSheetHeader title="Payment Link" onClose={dismissSheet} />

      {/* CONTENT */}

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,

          paddingVertical: spacing.lg,

          paddingBottom: spacing["2xl"],
        }}
      >
        {/* INFORMATION */}

        <BottomSheetSection title="Information">
          <View
            style={{
              gap: spacing.xs,
            }}
          >
            <AppText variant="bodyBold" numberOfLines={1}>
              {paymentLink?.name ?? "Payment Link"}
            </AppText>

            <AppText variant="bodySmall" color="secondary" numberOfLines={2}>
              {paymentLink
                ? getPaymentLinkUrl(paymentLink)
                : "No payment link selected"}
            </AppText>
          </View>
        </BottomSheetSection>

        {/* ACTIONS */}

        <BottomSheetSection title="Actions">
          {/* COPY */}

          <ListActionItem
            icon="copy-outline"
            title="Copy Link"
            onPress={handleCopyLink}
          />

          <Divider />

          {/* SHARE */}

          <ListActionItem
            icon="share-social-outline"
            title="Share Link"
            onPress={handleShareLink}
          />

          <Divider />

          {/* QR CODE */}

          <ListActionItem
            icon="qr-code-outline"
            title="View QR Code"
            onPress={handleQRCode}
          />

          <Divider />

          {/* DEACTIVATE */}

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
