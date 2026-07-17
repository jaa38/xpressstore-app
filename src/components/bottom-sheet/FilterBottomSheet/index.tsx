import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { Pressable, View } from "react-native";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { BottomSheetSection } from "@/components/ui/BottomSheetSection";

import { AmountRangeFilter } from "@/components/ui/AmountRangeFilter";

import type { AmountRange, OrderFilters } from "@/types/orderFilters";

interface FilterBottomSheetProps {}

export const FilterBottomSheet = forwardRef<
  BottomSheet,
  FilterBottomSheetProps
>(({}, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["50%"], []);

  const [amountRange, setAmountRange] = useState<AmountRange>({
    min: 0,
    max: 250000,
  });

  useImperativeHandle(ref, () => bottomSheetRef.current!, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{
        backgroundColor: theme.background.primary,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.border.default,
      }}
    >
      <BottomSheetView
        style={{
          flex: 1,
          padding: spacing.lg,
        }}
      >
        {/* Header */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <AppText variant="h2">Filters</AppText>

          <Pressable
            hitSlop={10}
            onPress={() => {
              bottomSheetRef.current?.close();
            }}
          >
            <Ionicons name="close" size={22} color={theme.text.primary} />
          </Pressable>
        </View>

        {/* Divider */}

        <View
          style={{
            height: 1,
            backgroundColor: theme.border.default,
            marginVertical: spacing.lg,
          }}
        />

        {/* Content */}

        <View
          style={{
            flex: 1,
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
            <View />
          </BottomSheetSection>

          <BottomSheetSection title="Sort By">
            <View />
          </BottomSheetSection>
        </View>

        {/* Footer */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: spacing.md,
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
      </BottomSheetView>
    </BottomSheet>
  );
});

FilterBottomSheet.displayName = "FilterBottomSheet";
