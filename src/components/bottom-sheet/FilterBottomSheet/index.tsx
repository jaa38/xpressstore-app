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

import { AmountRangeFilter } from "@/components/ui/AmountRangeFilter";
import { DateRangeFilter } from "@/components/ui/DateRangeFilter";
import { SortByFilter } from "@/components/ui/SortByFilter";

import { defaultOrderFilters } from "@/constants/defaultOrderFilters";

import { radius, spacing, theme } from "@/theme";

import type { OrderFilters } from "@/types/orderFilters";

interface FilterBottomSheetProps {
  draftFilters: OrderFilters;

  setDraftFilters: React.Dispatch<React.SetStateAction<OrderFilters>>;

  onApply: (filters: OrderFilters) => void;
}

export const FilterBottomSheet = forwardRef<
  BottomSheetModal,
  FilterBottomSheetProps
>(({ draftFilters, setDraftFilters, onApply }, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["85%"], []);

  /**
   * -----------------------------------------------------------------------
   * EXPOSE BOTTOM SHEET REF
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
    setDraftFilters(defaultOrderFilters);
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

      <BottomSheetHeader title="Filter & Sort" onClose={dismissSheet} />

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
        {/* AMOUNT RANGE */}

        <BottomSheetSection title="Amount Range">
          <AmountRangeFilter
            min={draftFilters.amount.min ?? 0}
            max={draftFilters.amount.max ?? 250000}
            onValueChange={(min, max) =>
              setDraftFilters((previous) => ({
                ...previous,

                amount: {
                  min,
                  max,
                },
              }))
            }
          />
        </BottomSheetSection>

        {/* DATE */}

        <BottomSheetSection title="Date">
          <DateRangeFilter
            value={draftFilters.date}
            onChange={(date) =>
              setDraftFilters((previous) => ({
                ...previous,

                date,
              }))
            }
          />
        </BottomSheetSection>

        {/* SORT */}

        <BottomSheetSection title="Sort By">
          <SortByFilter
            value={draftFilters.sort}
            onChange={(sort) =>
              setDraftFilters((previous) => ({
                ...previous,

                sort,
              }))
            }
          />
        </BottomSheetSection>
      </BottomSheetScrollView>

      {/* FOOTER */}

      <BottomSheetFooter>
        {/* RESET */}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reset filters"
          onPress={handleReset}
          style={({ pressed }) => ({
            flex: 1,

            height: 48,

            justifyContent: "center",

            alignItems: "center",

            borderRadius: radius.lg,

            borderWidth: 1,

            borderColor: theme.border.default,

            backgroundColor: pressed
              ? theme.background.subtle
              : theme.background.surface,

            opacity: pressed ? 0.8 : 1,
          })}
        >
          <AppText variant="button">Reset</AppText>
        </Pressable>

        {/* APPLY */}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Apply filters"
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

            opacity: pressed ? 0.9 : 1,
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

FilterBottomSheet.displayName = "FilterBottomSheet";
