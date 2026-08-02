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

import { defaultTransactionFilters } from "@/constants/defaultTransactionFilters";

import { TransactionFilters } from "@/types/transactionFilters";

import { radius, spacing, theme } from "@/theme";

interface TransactionFilterBottomSheetProps {
  draftFilters: TransactionFilters;
  setDraftFilters: React.Dispatch<
    React.SetStateAction<TransactionFilters>
  >;
  onApply: (filters: TransactionFilters) => void;
}

export const TransactionFilterBottomSheet = forwardRef<
  BottomSheetModal,
  TransactionFilterBottomSheetProps
>(
  (
    {
      draftFilters,
      setDraftFilters,
      onApply,
    },
    ref
  ) => {
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
          {/* Status */}

          <BottomSheetSection title="Status">
            <Pressable
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: spacing.sm,
              }}
            >
              {(["all", "paid", "pending", "failed"] as const).map(
                (status) => (
                  <UICard
                    key={status}
                    title={
                      status.charAt(0).toUpperCase() + status.slice(1)
                    }
                    variant={
                      draftFilters.status === status
                        ? "active"
                        : "default"
                    }
                    onPress={() =>
                      setDraftFilters((previous) => ({
                        ...previous,
                        status,
                      }))
                    }
                  />
                )
              )}
            </Pressable>
          </BottomSheetSection>

          {/* Payment Channel */}

          <BottomSheetSection title="Payment Channel">
            <Pressable
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: spacing.sm,
              }}
            >
              {(
                [
                  "all",
                  "card",
                  "transfer",
                  "bank",
                  "qr",
                  "ussd",
                ] as const
              ).map((channel) => (
                <UICard
                  key={channel}
                  title={
                    channel === "all"
                      ? "All"
                      : channel.toUpperCase()
                  }
                  variant={
                    draftFilters.channel === channel
                      ? "active"
                      : "default"
                  }
                  onPress={() =>
                    setDraftFilters((previous) => ({
                      ...previous,
                      channel,
                    }))
                  }
                />
              ))}
            </Pressable>
          </BottomSheetSection>

          {/* Transaction Type */}

          <BottomSheetSection title="Transaction Type">
            <Pressable
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: spacing.sm,
              }}
            >
              {(["all", "credit", "debit"] as const).map((type) => (
                <UICard
                  key={type}
                  title={
                    type.charAt(0).toUpperCase() + type.slice(1)
                  }
                  variant={
                    draftFilters.type === type
                      ? "active"
                      : "default"
                  }
                  onPress={() =>
                    setDraftFilters((previous) => ({
                      ...previous,
                      type,
                    }))
                  }
                />
              ))}
            </Pressable>
          </BottomSheetSection>
        </BottomSheetScrollView>

        <BottomSheetFooter>
          <Pressable
            onPress={() => {
              setDraftFilters(defaultTransactionFilters);
              onApply(defaultTransactionFilters);
              bottomSheetRef.current?.dismiss();
            }}
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
            onPress={() => {
              onApply(draftFilters);
              bottomSheetRef.current?.dismiss();
            }}
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

TransactionFilterBottomSheet.displayName =
  "TransactionFilterBottomSheet";