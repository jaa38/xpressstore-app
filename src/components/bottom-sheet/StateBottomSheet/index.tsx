import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { Input } from "@/components/ui/Input";

import { spacing } from "@/theme";

import { StateItem } from "./StateItem";
import { StateBottomSheetProps } from "./types";

export function StateBottomSheet({
  visible,
  countryCode,
  value,
  options,
  onSelect,
  onClose,
}: StateBottomSheetProps) {
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();

  // Filter states by selected country
  const countryStates = useMemo(() => {
    if (!countryCode) {
      return [];
    }

    return options.filter((state) => state.countryCode === countryCode);
  }, [countryCode, options]);

  // Apply search
  const filteredStates = useMemo(() => {
    if (!query) {
      return countryStates;
    }

    return countryStates.filter((state) =>
      state.label.toLowerCase().includes(query)
    );
  }, [countryStates, query]);

  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue);
    setSearch("");
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      title="Select State"
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
          placeholder="Search state..."
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
        {filteredStates.map((item) => (
          <StateItem
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
