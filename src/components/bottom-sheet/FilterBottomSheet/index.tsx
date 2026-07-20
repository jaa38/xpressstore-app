import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { Pressable, View } from "react-native";

import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
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
  BottomSheet,
  FilterBottomSheetProps
>(({ draftFilters, setDraftFilters, onApply }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["50%", "85%"], []);

  useImperativeHandle(ref, () => bottomSheetRef.current!, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{
        backgroundColor: theme.background.surface,
        borderTopLeftRadius: radius["2xl"],
        borderTopRightRadius: radius["2xl"],
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.border.default,
      }}
    >
      {/* Header */}

      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <AppText variant="h2">Filter & Sort</AppText>

          <Pressable
            hitSlop={10}
            onPress={() => bottomSheetRef.current?.close()}
          >
            <Ionicons name="close" size={22} color={theme.text.primary} />
          </Pressable>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: theme.border.default,
            marginTop: spacing.lg,
          }}
        />
      </View>

      {/* Scrollable Content */}

      <BottomSheetScrollView
        nestedScrollEnabled
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.lg,
          paddingBottom: spacing.xl,
        }}
      >
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

      <View
        style={{
          padding: spacing.lg,
          borderTopWidth: 1,
          borderTopColor: theme.border.default,
          flexDirection: "row",
          gap: spacing.md,
          backgroundColor: theme.background.surface,
        }}
      >
        <Pressable
          onPress={() => {
            setDraftFilters(defaultOrderFilters);
          }}
          style={{
            flex: 1,
            height: 48,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border.default,
          }}
        >
          <AppText variant="button">Reset</AppText>
        </Pressable>

        <Pressable
          onPress={() => {
            onApply(draftFilters);
            bottomSheetRef.current?.close();
          }}
          style={{
            flex: 1,
            height: 48,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12,
            backgroundColor: theme.button.primary.background,
          }}
        >
          <AppText variant="button" color="inverse">
            Apply
          </AppText>
        </Pressable>
      </View>

      {/* Footer */}
    </BottomSheet>
  );
});

FilterBottomSheet.displayName = "FilterBottomSheet";
