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
  type Ref,
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

import { CountryItem } from "./OptionItem";
import type { CountryBottomSheetProps } from "./types";

/**
 * ---------------------------------------------------------------------------
 * COMPONENT TYPE
 * ---------------------------------------------------------------------------
 */

type CountryBottomSheetComponent = <
  TValue extends string = string
>(
  props: CountryBottomSheetProps<TValue> & {
    ref?: Ref<BottomSheetModal>;
  }
) => ReactElement | null;

/**
 * ---------------------------------------------------------------------------
 * COMPONENT
 * ---------------------------------------------------------------------------
 */

const CountryBottomSheetInner = <
  TValue extends string = string
>(
  {
    visible,
    value,
    options,
    popularOptions = [],
    onSelect,
    onClose,
  }: CountryBottomSheetProps<TValue>,
  ref: ForwardedRef<BottomSheetModal>
) => {
  const bottomSheetRef =
    useRef<BottomSheetModal>(null);

  const [search, setSearch] =
    useState("");

  const snapPoints = useMemo(
    () => ["80%"],
    []
  );

  /**
   * -------------------------------------------------------------------------
   * EXPOSE BOTTOM SHEET REF
   * -------------------------------------------------------------------------
   */

  useImperativeHandle(
    ref,
    () => bottomSheetRef.current!,
    []
  );

  /**
   * -------------------------------------------------------------------------
   * OPEN / CLOSE
   * -------------------------------------------------------------------------
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

  const query = search
    .trim()
    .toLowerCase();

  const isSearching =
    query.length > 0;

  /**
   * -------------------------------------------------------------------------
   * FILTER OPTIONS
   * -------------------------------------------------------------------------
   */

  const filteredOptions = useMemo(() => {
    if (!isSearching) {
      return options;
    }

    return options.filter((option) =>
      option.label
        .toLowerCase()
        .includes(query)
    );
  }, [
    isSearching,
    query,
    options,
  ]);

  /**
   * -------------------------------------------------------------------------
   * REMAINING OPTIONS
   * -------------------------------------------------------------------------
   */

  const remainingOptions = useMemo(() => {
    if (isSearching) {
      return filteredOptions;
    }

    return filteredOptions.filter(
      (option) =>
        !popularOptions.some(
          (popular) =>
            popular.value ===
            option.value
        )
    );
  }, [
    filteredOptions,
    popularOptions,
    isSearching,
  ]);

  /**
   * -------------------------------------------------------------------------
   * BACKDROP
   * -------------------------------------------------------------------------
   */

  const renderBackdrop =
    useCallback(
      (
        props: BottomSheetBackdropProps
      ) => (
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
   * SELECT COUNTRY
   * -------------------------------------------------------------------------
   */

  const handleSelect = (
    selectedValue: TValue
  ) => {
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
        backgroundColor:
          theme.background.surface,

        borderTopLeftRadius:
          radius["2xl"],

        borderTopRightRadius:
          radius["2xl"],
      }}
      handleIndicatorStyle={{
        backgroundColor:
          theme.border.default,
      }}
    >
      {/* HEADER */}

      <BottomSheetHeader
        title="Select Country"
        onClose={handleClose}
      />

      {/* CONTENT */}

      <BottomSheetScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal:
            spacing.lg,

          paddingTop: spacing.lg,

          paddingBottom:
            spacing["2xl"],
        }}
      >
        {/* SEARCH */}

        <View
          style={{
            marginBottom: spacing.lg,
          }}
        >
          <Input
            placeholder="Search country..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* POPULAR COUNTRIES */}

        {!isSearching &&
          popularOptions.length > 0 && (
            <>
              <AppText
                variant="caption"
                color="secondary"
                style={{
                  marginBottom:
                    spacing.sm,
                }}
              >
                Popular
              </AppText>

              {popularOptions.map(
                (item) => (
                  <CountryItem
                    key={item.value}
                    item={item}
                    selected={
                      item.value === value
                    }
                    onPress={() =>
                      handleSelect(
                        item.value
                      )
                    }
                  />
                )
              )}

              <Divider
                style={{
                  marginVertical:
                    spacing.md,
                }}
              />
            </>
          )}

        {/* ALL COUNTRIES */}

        {!isSearching && (
          <AppText
            variant="caption"
            color="secondary"
            style={{
              marginBottom:
                spacing.sm,
            }}
          >
            All Countries
          </AppText>
        )}

        {/* COUNTRY LIST */}

        {remainingOptions.map(
          (item) => (
            <CountryItem
              key={item.value}
              item={item}
              selected={
                item.value === value
              }
              onPress={() =>
                handleSelect(
                  item.value
                )
              }
            />
          )
        )}

        {/* EMPTY STATE */}

        {filteredOptions.length ===
          0 && (
          <View
            style={{
              alignItems: "center",
              paddingVertical:
                spacing.xl,
            }}
          >
            <AppText
              variant="bodyBold"
              color="primary"
            >
              No countries found
            </AppText>

            <AppText
              variant="bodySmall"
              color="secondary"
              align="center"
              style={{
                marginTop:
                  spacing.xs,
              }}
            >
              Try searching for a
              different country.
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

export const CountryBottomSheet =
  forwardRef<
    BottomSheetModal,
    CountryBottomSheetProps<string>
  >(CountryBottomSheetInner) as CountryBottomSheetComponent;