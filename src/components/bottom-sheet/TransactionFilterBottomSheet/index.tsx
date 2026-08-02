import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import { Pressable } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { AppText } from "@/components/ui/AppText";
import { BottomSheetHeader } from "@/components/ui/BottomSheetHeader";
import { BottomSheetFooter } from "@/components/ui/BottomSheetFooter";
import { BottomSheetSection } from "@/components/ui/BottomSheetSection";
import { UICard } from "@/components/ui/UICard";

import { radius, spacing, theme } from "@/theme";

export const TransactionFilterBottomSheet = forwardRef<BottomSheetModal>(
  (_, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const snapPoints = useMemo(() => ["75%"], []);

    useImperativeHandle(ref, () => bottomSheetRef.current!, []);

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
        <BottomSheetHeader
          title="Filter Transactions"
          onClose={() => bottomSheetRef.current?.dismiss()}
        />

        <BottomSheetScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.lg,
            paddingBottom: spacing.xl,
          }}
        >
          <BottomSheetSection title="Status">
            <Pressable
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: spacing.sm,
              }}
            >
              <UICard title="All" variant="active" />
              <UICard title="Paid" variant="default" />
              <UICard title="Pending" variant="default" />
              <UICard title="Failed" variant="default" />
            </Pressable>
          </BottomSheetSection>

          <BottomSheetSection title="Payment Channel">
            <Pressable
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: spacing.sm,
              }}
            >
              <UICard title="Card" variant="default" />
              <UICard title="Transfer" variant="default" />
              <UICard title="Bank" variant="default" />
              <UICard title="QR" variant="default" />
              <UICard title="USSD" variant="default" />
            </Pressable>
          </BottomSheetSection>
        </BottomSheetScrollView>

        <BottomSheetFooter>
          <Pressable
            style={{
              flex: 1,
              height: 48,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: theme.border.default,
            }}
          >
            <AppText variant="button">Reset</AppText>
          </Pressable>

          <Pressable
            style={{
              flex: 1,
              height: 48,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: radius.lg,
              backgroundColor: theme.button.primary.background,
            }}
          >
            <AppText variant="button" color="inverse">
              Apply
            </AppText>
          </Pressable>
        </BottomSheetFooter>
      </BottomSheetModal>
    );
  }
);

TransactionFilterBottomSheet.displayName = "TransactionFilterBottomSheet";
