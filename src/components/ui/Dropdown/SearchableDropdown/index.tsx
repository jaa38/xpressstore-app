import { useMemo, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { radius, spacing, theme } from "@/theme";

import { Input } from "@/components/ui/Input";

export type DropdownOption<TValue extends string = string> = {
  label: string;
  value: TValue;
};

interface SearchableDropdownProps<TValue extends string = string> {
  label?: string;
  required?: boolean;
  placeholder?: string;

  value?: TValue;

  error?: string;

  options: DropdownOption<TValue>[];

  onSelect: (value: TValue) => void;
}

export function SearchableDropdown<TValue extends string = string>({
  label,
  required = false,
  placeholder = "Select option",
  value,
  error,
  options,
  onSelect,
}: SearchableDropdownProps<TValue>) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [search, setSearch] = useState("");

  const snapPoints = useMemo(() => ["75%"], []);

  const selected = options.find((item) => item.value === value);

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  }, [search, options]);

  return (
    <>
      {label && (
        <View
          style={{
            flexDirection: "row",
            marginBottom: spacing.sm,
          }}
        >
          <AppText variant="caption" color="secondary">
            {label}
          </AppText>

          {required && (
            <AppText
              variant="caption"
              style={{
                color: theme.text.error,
              }}
            >
              {" *"}
            </AppText>
          )}
        </View>
      )}

      <Pressable
        onPress={() => {
          setSearch("");
          bottomSheetRef.current?.present();
        }}
        style={{
          height: 48,
          borderWidth: 1,
          borderColor: error ? theme.input.errorBorder : theme.input.border,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: theme.input.background,
        }}
      >
        <AppText
          variant="body"
          style={{
            color: selected ? theme.input.text : theme.input.placeholder,
          }}
        >
          {selected?.label ?? placeholder}
        </AppText>

        <Ionicons name="chevron-down" size={20} color={theme.input.icon} />
      </Pressable>

      {error && (
        <AppText
          variant="caption"
          color="error"
          style={{
            marginTop: spacing.xs,
          }}
        >
          {error}
        </AppText>
      )}

      <BottomSheetModal ref={bottomSheetRef} snapPoints={snapPoints}>
        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.sm,
          }}
        >
          <Input
            placeholder="Search country..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <BottomSheetFlatList
          data={filteredOptions}
          keyExtractor={(item) => item.value}
          contentContainerStyle={{
            paddingVertical: spacing.sm,
          }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onSelect(item.value);
                setSearch("");
                bottomSheetRef.current?.dismiss();
              }}
              style={{
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <AppText variant="body">{item.label}</AppText>

              {item.value === value && (
                <Ionicons
                  name="checkmark"
                  size={20}
                  color={theme.action.primary.background}
                />
              )}
            </Pressable>
          )}
        />
      </BottomSheetModal>
    </>
  );
}
