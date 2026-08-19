import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ForwardedRef,
  type ReactElement,
} from "react";

import { View } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { BottomSheetHeader } from "@/components/ui/BottomSheetHeader";
import { Divider } from "@/components/ui/Divider";
import { Input } from "@/components/ui/Input";
import { AppText } from "@/components/ui/AppText";

import { radius, spacing, theme } from "@/theme";

import { StateItem } from "./StateItem";
import type { StateBottomSheetProps } from "./types";

/**
 * ---------------------------------------------------------------------------
 * COMPONENT TYPE
 * ---------------------------------------------------------------------------
 */

type StateBottomSheetComponent = (
  props: StateBottomSheetProps & {
    ref?: React.Ref<BottomSheetModal>;
  }
) => ReactElement | null;

/**
 * ---------------------------------------------------------------------------
 * COMPONENT
 * ---------------------------------------------------------------------------
 */

const StateBottomSheetInner = (
  {
    visible,
    countryCode,
    value,
    options,
    onSelect,
    onClose,
  }: StateBottomSheetProps,
  ref: ForwardedRef<BottomSheetModal>
) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [search, setSearch] = useState("");

  const snapPoints = useMemo(() => ["80%"], []);

  /**
   * -------------------------------------------------------------------------
   * EXPOSE BOTTOM SHEET REF
   * -------------------------------------------------------------------------
   */

  useImperativeHandle(ref, () => bottomSheetRef.current!, []);

  /**
   * -------------------------------------------------------------------------
   * OPEN / CLOSE
   * -------------------------------------------------------------------------
   *
   * Keeps compatibility with the existing `visible` prop.
   */

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();

      setSearch("");
    }
  }, [visible]);

  /**
   * -------------------------------------------------------------------------
   * SEARCH
   * -------------------------------------------------------------------------
   */

  const query = search.trim().toLowerCase();

  const isSearching = query.length > 0;

  /**
   * -------------------------------------------------------------------------
   * FILTER STATES BY COUNTRY
   * -------------------------------------------------------------------------
   */

  const countryStates = useMemo(() => {
    if (!countryCode) {
      return [];
    }

    return options.filter((state) => state.countryCode === countryCode);
  }, [countryCode, options]);

  /**
   * -------------------------------------------------------------------------
   * FILTER STATES BY SEARCH
   * -------------------------------------------------------------------------
   */

  const filteredStates = useMemo(() => {
    if (!isSearching) {
      return countryStates;
    }

    return countryStates.filter((state) =>
      state.label.toLowerCase().includes(query)
    );
  }, [countryStates, isSearching, query]);

  /**
   * -------------------------------------------------------------------------
   * BACKDROP
   * -------------------------------------------------------------------------
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
   * -------------------------------------------------------------------------
   * CLOSE
   * -------------------------------------------------------------------------
   */

  const handleClose = () => {
    setSearch("");

    bottomSheetRef.current?.dismiss();

    onClose();
  };

  /**
   * -------------------------------------------------------------------------
   * SELECT STATE
   * -------------------------------------------------------------------------
   */

  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue);

    setSearch("");

    bottomSheetRef.current?.dismiss();

    onClose();
  };

  /**
   * -------------------------------------------------------------------------
   * DISMISSED
   * -------------------------------------------------------------------------
   */

  const handleDismiss = () => {
    setSearch("");

    onClose();
  };

  /**
   * -------------------------------------------------------------------------
   * RENDER
   * -------------------------------------------------------------------------
   */

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDismissOnClose
      backdropComponent={renderBackdrop}
      onDismiss={handleDismiss}
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

      <BottomSheetHeader title="Select State" onClose={handleClose} />

      {/* CONTENT */}

      <BottomSheetScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,

          paddingTop: spacing.lg,

          paddingBottom: spacing["2xl"],
        }}
      >
        {/* SEARCH */}

        <View
          style={{
            marginBottom: spacing.lg,
          }}
        >
          <Input
            placeholder="Search state..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* STATES */}

        {filteredStates.map((item, index) => (
          <View key={item.value}>
            <StateItem
              item={item}
              selected={item.value === value}
              onPress={() => handleSelect(item.value)}
            />

            {index < filteredStates.length - 1 && <Divider />}
          </View>
        ))}

        {/* EMPTY STATE */}

        {filteredStates.length === 0 && (
          <View
            style={{
              alignItems: "center",

              paddingVertical: spacing.xl,
            }}
          >
            <AppText variant="bodyBold" color="primary">
              No states found
            </AppText>

            <AppText
              variant="bodySmall"
              color="secondary"
              align="center"
              style={{
                marginTop: spacing.xs,
              }}
            >
              {countryCode
                ? "Try searching for a different state."
                : "Select a country first."}
            </AppText>
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

/**
 * ---------------------------------------------------------------------------
 * FORWARD REF
 * ---------------------------------------------------------------------------
 */

export const StateBottomSheet = forwardRef<
  BottomSheetModal,
  StateBottomSheetProps
>(StateBottomSheetInner) as StateBottomSheetComponent;

StateBottomSheetInner.displayName = "StateBottomSheet";
