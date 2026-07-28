import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { Input } from "@/components/ui/Input";

import { spacing } from "@/theme";

import { CityItem } from "./CityItem";
import { CityBottomSheetProps } from "./types";

export function CityBottomSheet({
  visible,
  countryCode,
  stateCode,
  value,
  options,
  onSelect,
  onClose,
}: CityBottomSheetProps) {
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();

  const availableCities = useMemo(() => {
    if (!countryCode || !stateCode) {
      return [];
    }

    return options.filter(
      (city) =>
        city.countryCode === countryCode &&
        city.stateCode === stateCode
    );
  }, [countryCode, stateCode, options]);

  const filteredCities = useMemo(() => {
    if (!query) {
      return availableCities;
    }

    return availableCities.filter((city) =>
      city.label.toLowerCase().includes(query)
    );
  }, [availableCities, query]);

  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue);

    setSearch("");

    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      title="Select City"
      onClose={() => {
        setSearch("");

        onClose();
      }}
      showCloseButton={false}
    >
      <View
        style={{
          paddingTop: spacing.md,
          paddingBottom: spacing.md,
        }}
      >
        <Input
          placeholder="Search city..."
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
        {filteredCities.map((item) => (
          <CityItem
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