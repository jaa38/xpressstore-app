import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import { Pressable, View } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { BottomSheetHeader } from "@/components/ui/BottomSheetHeader";
import { BottomSheetSection } from "@/components/ui/BottomSheetSection";
import { Divider } from "@/components/ui/Divider";

import { radius, spacing, theme } from "@/theme";

export type StoreFilter = "all" | "active" | "inactive";

interface StoreFrontBottomSheetProps {
  selectedFilter: StoreFilter;

  onFilterChange: (filter: StoreFilter) => void;
}

export const StoreFrontBottomSheet = forwardRef<
  BottomSheetModal,
  StoreFrontBottomSheetProps
>(({ selectedFilter, onFilterChange }, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["50%"], []);

  useImperativeHandle(ref, () => bottomSheetRef.current!, []);

  /*
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
      />
    ),
    []
  );

  /*
   * -----------------------------------------------------------------------
   * DISMISS
   * -----------------------------------------------------------------------
   */

  const dismissSheet = () => {
    bottomSheetRef.current?.dismiss();
  };

  /*
   * -----------------------------------------------------------------------
   * FILTER
   * -----------------------------------------------------------------------
   */

  const handleFilterChange = (filter: StoreFilter) => {
    onFilterChange(filter);

    dismissSheet();
  };

  /*
   * -----------------------------------------------------------------------
   * FILTER ROW
   * -----------------------------------------------------------------------
   */

  const FilterRow = ({
    icon,
    iconColor,
    title,
    filter,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    title: string;
    filter: StoreFilter;
  }) => {
    const selected = selectedFilter === filter;

    return (
      <Pressable
        accessibilityRole="radio"
        accessibilityState={{
          selected,
        }}
        accessibilityLabel={title}
        onPress={() => handleFilterChange(filter)}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",

          paddingVertical: spacing.md,

          opacity: pressed ? 0.6 : 1,
        })}
      >
        {/* LEFT */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,

              borderRadius: radius.full,

              alignItems: "center",
              justifyContent: "center",

              backgroundColor: selected
                ? theme.icon.active.background
                : theme.icon.default.background,
            }}
          >
            <Ionicons
              name={icon}
              size={21}
              color={selected ? theme.icon.active.icon : iconColor}
            />
          </View>

          <AppText variant="body">{title}</AppText>
        </View>

        {/* CHECK */}

        {selected && (
          <Ionicons
            name="checkmark-circle"
            size={22}
            color={theme.icon.active.icon}
          />
        )}
      </Pressable>
    );
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

      <BottomSheetHeader title="Filter Stores" onClose={dismissSheet} />

      {/* CONTENT */}

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,

          paddingVertical: spacing.lg,

          paddingBottom: spacing["2xl"],
        }}
      >
        <BottomSheetSection title="Store Status">
          {/* ALL STORES */}

          <FilterRow
            icon="storefront-outline"
            iconColor={theme.icon.default.icon}
            title="All Stores"
            filter="all"
          />

          <Divider />

          {/* ACTIVE */}

          <FilterRow
            icon="checkmark-circle-outline"
            iconColor={theme.icon.success.icon}
            title="Active"
            filter="active"
          />

          <Divider />

          {/* INACTIVE */}

          <FilterRow
            icon="close-circle-outline"
            iconColor={theme.icon.error.icon}
            title="Inactive"
            filter="inactive"
          />
        </BottomSheetSection>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

StoreFrontBottomSheet.displayName = "StoreFrontBottomSheet";
