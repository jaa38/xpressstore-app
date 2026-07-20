import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { Pressable, View } from "react-native";

import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { BottomSheetSection } from "@/components/ui/BottomSheetSection";
import { AmountRangeFilter } from "@/components/ui/AmountRangeFilter";
import { DateRangeFilter } from "@/components/ui/DateRangeFilter";
import { SortByFilter } from "@/components/ui/SortByFilter";

import { ScrollView } from "react-native";

import { radius, spacing, theme } from "@/theme";

import type {
  AmountRange,
  DateRange,
  OrderFilters,
} from "@/types/orderFilters";

interface FilterBottomSheetProps {}

export const FilterBottomSheet = forwardRef<
  BottomSheet,
  FilterBottomSheetProps
>(({}, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["50%", "85%"], []);

  useImperativeHandle(ref, () => bottomSheetRef.current!, []);

  const [amountRange, setAmountRange] = useState<AmountRange>({
    min: 0,
    max: 250000,
  });

  const [dateRange, setDateRange] = useState<DateRange>({});

  const [filters, setFilters] = useState<OrderFilters>({
    amount: {
      min: 0,
      max: 250000,
    },
    date: {},
    sort: "mostRecent",
  });

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
            min={amountRange.min}
            max={amountRange.max}
            onValueChange={(min, max) =>
              setAmountRange({
                min,
                max,
              })
            }
          />
        </BottomSheetSection>

        <BottomSheetSection title="Date">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        </BottomSheetSection>

        <BottomSheetSection title="Sort By">
          <SortByFilter
            value={filters.sort}
            onChange={(sort) =>
              setFilters((previous) => ({
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
