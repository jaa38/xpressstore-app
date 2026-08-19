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
import { BottomSheetFooter } from "@/components/ui/BottomSheetFooter";
import { BottomSheetHeader } from "@/components/ui/BottomSheetHeader";
import { BottomSheetSection } from "@/components/ui/BottomSheetSection";
import { UICard } from "@/components/ui/UICard";
import { AmountRangeFilter } from "@/components/ui/AmountRangeFilter";
import { DateRangeFilter } from "@/components/ui/DateRangeFilter";

import { defaultTransactionFilters } from "@/constants/defaultTransactionFilters";

import type { TransactionFilters } from "@/types/transactionFilters";

import { radius, spacing, theme } from "@/theme";

/**
 * ---------------------------------------------------------------------------
 * TYPES
 * ---------------------------------------------------------------------------
 */

interface TransactionFilterBottomSheetProps {
  draftFilters: TransactionFilters;

  setDraftFilters: React.Dispatch<React.SetStateAction<TransactionFilters>>;

  onApply: (filters: TransactionFilters) => void;
}

/**
 * ---------------------------------------------------------------------------
 * OPTIONS
 * ---------------------------------------------------------------------------
 */

const PAYMENT_CHANNELS = [
  "all",
  "card",
  "transfer",
  "bank",
  "qr",
  "ussd",
] as const;

const TRANSACTION_TYPES = ["all", "credit", "debit"] as const;

/**
 * ---------------------------------------------------------------------------
 * COMPONENT
 * ---------------------------------------------------------------------------
 */

export const TransactionFilterBottomSheet = forwardRef<
  BottomSheetModal,
  TransactionFilterBottomSheetProps
>(({ draftFilters, setDraftFilters, onApply }, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["75%"], []);

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
   * CLOSE
   * -----------------------------------------------------------------------
   */

  const dismissSheet = () => {
    bottomSheetRef.current?.dismiss();
  };

  /**
   * -----------------------------------------------------------------------
   * RESET
   * -----------------------------------------------------------------------
   */

  const handleReset = () => {
    setDraftFilters(defaultTransactionFilters);

    onApply(defaultTransactionFilters);

    dismissSheet();
  };

  /**
   * -----------------------------------------------------------------------
   * APPLY
   * -----------------------------------------------------------------------
   */

  const handleApply = () => {
    onApply(draftFilters);

    dismissSheet();
  };

  /**
   * -----------------------------------------------------------------------
   * PAYMENT CHANNEL
   * -----------------------------------------------------------------------
   */

  const handleChannelChange = (channel: TransactionFilters["channel"]) => {
    setDraftFilters((previous) => ({
      ...previous,
      channel,
    }));
  };

  /**
   * -----------------------------------------------------------------------
   * TRANSACTION TYPE
   * -----------------------------------------------------------------------
   */

  const handleTypeChange = (type: TransactionFilters["type"]) => {
    setDraftFilters((previous) => ({
      ...previous,
      type,
    }));
  };

  /**
   * -----------------------------------------------------------------------
   * AMOUNT RANGE
   * -----------------------------------------------------------------------
   */

  const handleAmountChange = (min?: number, max?: number) => {
    setDraftFilters((previous) => ({
      ...previous,

      amount: {
        min: min ?? previous.amount.min,
        max: max ?? previous.amount.max,
      },
    }));
  };

  /**
   * -----------------------------------------------------------------------
   * DATE
   * -----------------------------------------------------------------------
   */

  const handleDateChange = (date: TransactionFilters["date"]) => {
    setDraftFilters((previous) => ({
      ...previous,
      date,
    }));
  };

  /**
   * -----------------------------------------------------------------------
   * PAYMENT CHANNEL LABEL
   * -----------------------------------------------------------------------
   */

  const getChannelLabel = (channel: (typeof PAYMENT_CHANNELS)[number]) => {
    if (channel === "all") {
      return "All";
    }

    return channel.toUpperCase();
  };

  /**
   * -----------------------------------------------------------------------
   * TRANSACTION TYPE LABEL
   * -----------------------------------------------------------------------
   */

  const getTypeLabel = (type: (typeof TRANSACTION_TYPES)[number]) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
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

      <BottomSheetHeader title="Filter Transactions" onClose={dismissSheet} />

      {/* CONTENT */}

      <BottomSheetScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,

          paddingVertical: spacing.lg,

          paddingBottom: spacing.xl,
        }}
      >
        {/* PAYMENT CHANNEL */}

        <BottomSheetSection title="Payment Channel">
          <Pressable
            accessibilityRole="radiogroup"
            style={{
              flexDirection: "row",

              flexWrap: "wrap",

              gap: spacing.sm,
            }}
          >
            {PAYMENT_CHANNELS.map((channel) => (
              <UICard
                key={channel}
                title={getChannelLabel(channel)}
                variant={
                  draftFilters.channel === channel ? "active" : "default"
                }
                onPress={() => handleChannelChange(channel)}
              />
            ))}
          </Pressable>
        </BottomSheetSection>

        {/* TRANSACTION TYPE */}

        <BottomSheetSection title="Transaction Type">
          <Pressable
            accessibilityRole="radiogroup"
            style={{
              flexDirection: "row",

              flexWrap: "wrap",

              gap: spacing.sm,
            }}
          >
            {TRANSACTION_TYPES.map((type) => (
              <UICard
                key={type}
                title={getTypeLabel(type)}
                variant={draftFilters.type === type ? "active" : "default"}
                onPress={() => handleTypeChange(type)}
              />
            ))}
          </Pressable>
        </BottomSheetSection>

        {/* AMOUNT RANGE */}

        <BottomSheetSection title="Amount Range">
          <AmountRangeFilter
            min={draftFilters.amount.min}
            max={draftFilters.amount.max}
            maximumValue={1000000}
            onValueChange={handleAmountChange}
          />
        </BottomSheetSection>

        {/* DATE */}

        <BottomSheetSection title="Date">
          <DateRangeFilter
            value={draftFilters.date}
            onChange={handleDateChange}
          />
        </BottomSheetSection>
      </BottomSheetScrollView>

      {/* FOOTER */}

      <BottomSheetFooter>
        {/* RESET */}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reset transaction filters"
          onPress={handleReset}
          style={({ pressed }) => ({
            flex: 1,

            height: 48,

            justifyContent: "center",

            alignItems: "center",

            borderRadius: radius.lg,

            borderWidth: 1,

            borderColor: theme.border.default,

            opacity: pressed ? 0.7 : 1,
          })}
        >
          <AppText variant="button">Reset</AppText>
        </Pressable>

        {/* APPLY */}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Apply transaction filters"
          onPress={handleApply}
          style={({ pressed }) => ({
            flex: 1,

            height: 48,

            justifyContent: "center",

            alignItems: "center",

            borderRadius: radius.lg,

            backgroundColor: pressed
              ? theme.button.primary.pressed
              : theme.button.primary.background,
          })}
        >
          <AppText variant="button" color="inverse">
            Apply
          </AppText>
        </Pressable>
      </BottomSheetFooter>
    </BottomSheetModal>
  );
});

TransactionFilterBottomSheet.displayName = "TransactionFilterBottomSheet";
