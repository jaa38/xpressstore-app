import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { Divider } from "@/components/ui/Divider";
import { Input } from "@/components/ui/Input";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { AppText } from "@/components/ui/AppText";

import { spacing } from "@/theme";

import { CountryItem } from "./OptionItem";
import { CountryBottomSheetProps } from "./types";

export function CountryBottomSheet<TValue extends string = string>({
  visible,
  value,
  options,
  popularOptions = [],
  onSelect,
  onClose,
}: CountryBottomSheetProps<TValue>) {
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();

  const isSearching = query.length > 0;

  const filteredOptions = useMemo(() => {
    if (!isSearching) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  }, [isSearching, query, options]);

  const remainingOptions = useMemo(() => {
    if (isSearching) {
      return filteredOptions;
    }

    return filteredOptions.filter(
      (option) =>
        !popularOptions.some((popular) => popular.value === option.value)
    );
  }, [filteredOptions, popularOptions, isSearching]);

  const handleSelect = (selectedValue: TValue) => {
    onSelect(selectedValue);
    setSearch("");
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      title="Select Country"
      onClose={() => {
        setSearch("");
        onClose();
      }}
      showCloseButton={false}
      scrollable={false}
    >
      <View
        style={{
          paddingTop: spacing.md,
          paddingBottom: spacing.md,
        }}
      >
        <Input
          placeholder="Search country..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: spacing.xl,
        }}
      >
        {!isSearching && popularOptions.length > 0 && (
          <>
            <AppText
              variant="caption"
              color="secondary"
              style={{
                marginBottom: spacing.sm,
              }}
            >
              Popular
            </AppText>

            {popularOptions.map((item) => (
              <CountryItem
                key={item.value}
                item={item}
                selected={item.value === value}
                onPress={() => handleSelect(item.value)}
              />
            ))}

            <Divider
              style={{
                marginVertical: spacing.md,
              }}
            />
          </>
        )}

        {!isSearching && (
          <AppText
            variant="caption"
            color="secondary"
            style={{
              marginBottom: spacing.sm,
            }}
          >
            All Countries
          </AppText>
        )}

        {remainingOptions.map((item) => (
          <CountryItem
            key={item.value}
            item={item}
            selected={item.value === value}
            onPress={() => handleSelect(item.value)}
          />
        ))}
      </ScrollView>
    </BottomSheet>
  );
}
