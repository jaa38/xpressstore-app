import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { View } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { Input } from "@/components/ui/Input";
import { BottomSheetHeader } from "@/components/ui/BottomSheetHeader";

import { radius, spacing, theme } from "@/theme";

import { CityItem } from "./CityItem";

import type { CityBottomSheetProps } from "./types";

export const CityBottomSheet =
  forwardRef<
    BottomSheetModal,
    CityBottomSheetProps
  >(
    (
      {
        visible,
        countryCode,
        stateCode,
        value,
        options,
        onSelect,
        onClose,
      },
      ref
    ) => {
      const bottomSheetRef =
        useRef<BottomSheetModal>(null);

      const [search, setSearch] =
        useState("");

      const snapPoints = useMemo(
        () => ["70%"],
        []
      );

      /*
       * -----------------------------------------------------------------------
       * EXPOSE BOTTOM SHEET REF
       * -----------------------------------------------------------------------
       */

      useImperativeHandle(
        ref,
        () => bottomSheetRef.current!,
        []
      );

      /*
       * -----------------------------------------------------------------------
       * OPEN / CLOSE
       * -----------------------------------------------------------------------
       *
       * Keeps the component compatible with the existing `visible` prop.
       */

      useEffect(() => {
        if (visible) {
          bottomSheetRef.current?.present();
        } else {
          bottomSheetRef.current?.dismiss();
          setSearch("");
        }
      }, [visible]);

      /*
       * -----------------------------------------------------------------------
       * SEARCH QUERY
       * -----------------------------------------------------------------------
       */

      const query = search
        .trim()
        .toLowerCase();

      /*
       * -----------------------------------------------------------------------
       * AVAILABLE CITIES
       * -----------------------------------------------------------------------
       */

      const availableCities = useMemo(() => {
        if (!countryCode || !stateCode) {
          return [];
        }

        return options.filter(
          (city) =>
            city.countryCode ===
              countryCode &&
            city.stateCode === stateCode
        );
      }, [
        countryCode,
        stateCode,
        options,
      ]);

      /*
       * -----------------------------------------------------------------------
       * FILTERED CITIES
       * -----------------------------------------------------------------------
       */

      const filteredCities = useMemo(() => {
        if (!query) {
          return availableCities;
        }

        return availableCities.filter(
          (city) =>
            city.label
              .toLowerCase()
              .includes(query)
        );
      }, [
        availableCities,
        query,
      ]);

      /*
       * -----------------------------------------------------------------------
       * BACKDROP
       * -----------------------------------------------------------------------
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

      /*
       * -----------------------------------------------------------------------
       * CLOSE
       * -----------------------------------------------------------------------
       */

      const handleClose = () => {
        setSearch("");

        bottomSheetRef.current?.dismiss();

        onClose();
      };

      /*
       * -----------------------------------------------------------------------
       * SELECT CITY
       * -----------------------------------------------------------------------
       */

      const handleSelect = (
        selectedValue: string
      ) => {
        onSelect(selectedValue);

        setSearch("");

        bottomSheetRef.current?.dismiss();

        onClose();
      };

      /*
       * -----------------------------------------------------------------------
       * SHEET DISMISSED
       * -----------------------------------------------------------------------
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
          backdropComponent={
            renderBackdrop
          }
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
            title="Select City"
            onClose={handleClose}
          />

          {/* CONTENT */}

          <BottomSheetScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={
              false
            }
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
                marginBottom:
                  spacing.lg,
              }}
            >
              <Input
                placeholder="Search city..."
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {/* CITIES */}

            <View>
              {filteredCities.map(
                (item) => (
                  <CityItem
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
            </View>
          </BottomSheetScrollView>
        </BottomSheetModal>
      );
    }
  );

CityBottomSheet.displayName =
  "CityBottomSheet";