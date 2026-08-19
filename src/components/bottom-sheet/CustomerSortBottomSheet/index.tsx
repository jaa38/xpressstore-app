import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { Pressable, View } from "react-native";

import { BottomSheetHeader } from "@/components/ui/BottomSheetHeader";
import { BottomSheetFooter } from "@/components/ui/BottomSheetFooter";
import { BottomSheetSection } from "@/components/ui/BottomSheetSection";
import { AppText } from "@/components/ui/AppText";

import { CustomerSortOptions } from "@/components/customers/CustomerSortOptions";

import type { CustomerSort } from "@/types/customer-sort";

import { radius, spacing, theme } from "@/theme";

interface CustomerSortBottomSheetProps {
  draftSort: CustomerSort;

  setDraftSort: React.Dispatch<React.SetStateAction<CustomerSort>>;

  onApply: (sort: CustomerSort) => void;
}

export const CustomerSortBottomSheet = forwardRef<
  BottomSheetModal,
  CustomerSortBottomSheetProps
>(({ draftSort, setDraftSort, onApply }, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["55%"], []);

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
    const defaultSort: CustomerSort = "firstNameAsc";

    setDraftSort(defaultSort);

    onApply(defaultSort);

    dismissSheet();
  };

  /**
   * -----------------------------------------------------------------------
   * APPLY
   * -----------------------------------------------------------------------
   */

  const handleApply = () => {
    onApply(draftSort);

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

      <BottomSheetHeader title="Sort Customers" onClose={dismissSheet} />

      {/* CONTENT */}

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,

          paddingVertical: spacing.lg,

          paddingBottom: spacing.lg,
        }}
      >
        <BottomSheetSection title="Sort By">
          <CustomerSortOptions value={draftSort} onChange={setDraftSort} />
        </BottomSheetSection>
      </BottomSheetScrollView>

      {/* FOOTER */}

      <BottomSheetFooter>
        {/* RESET */}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reset customer sort"
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
          accessibilityLabel="Apply customer sort"
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

CustomerSortBottomSheet.displayName = "CustomerSortBottomSheet";
