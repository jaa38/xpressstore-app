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

import { theme, radius, spacing } from "@/theme";

import { BottomSheetHeader } from "@/components/ui/BottomSheetHeader";
import { BottomSheetFooter } from "@/components/ui/BottomSheetFooter";
import { BottomSheetSection } from "@/components/ui/BottomSheetSection";

import type { CustomerSort } from "@/types/customer-sort";

import { CustomerSortOptions } from "@/components/customer/CustomerSortOptions";

import { Pressable } from "react-native";

import { AppText } from "@/components/ui/AppText";

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

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={0.4}
        enableTouchThrough={false}
        accessibilityRole="button"
        accessibilityLabel="Dismiss sort panel"
      />
    ),
    []
  );

  useImperativeHandle(ref, () => bottomSheetRef.current!, []);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDismissOnClose
      backdropComponent={renderBackdrop}
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
        title="Sort Customers"
        onClose={() => bottomSheetRef.current?.dismiss()}
      />
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.lg,
        }}
      >
        <BottomSheetSection title="Sort By">
          <CustomerSortOptions value={draftSort} onChange={setDraftSort} />
        </BottomSheetSection>
      </BottomSheetScrollView>
      <BottomSheetFooter>
        <Pressable
          onPress={() => {
            setDraftSort("firstNameAsc");
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
            onApply(draftSort);
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
});

CustomerSortBottomSheet.displayName = "CustomerSortBottomSheet";
