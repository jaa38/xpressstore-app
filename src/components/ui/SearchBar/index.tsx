import { View, TextInput, StyleSheet } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "@/theme";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";

interface SearchBarProps {
  value?: string;

  onChangeText?: (text: string) => void;

  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search",
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={20}
        color={theme.icon.default.icon}
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.input.placeholder}
        style={styles.input}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,

    borderWidth: 1,

    borderColor: theme.input.border,

    borderRadius: radius.md,

    backgroundColor: theme.input.background,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 16,

    gap: 12,
  },

  input: {
    flex: 1,

    color: theme.input.text,

    ...typography.body,
  },
});
