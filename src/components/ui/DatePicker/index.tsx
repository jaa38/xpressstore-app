import { useState } from "react";

import { Platform, Pressable, StyleSheet, View } from "react-native";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { theme } from "@/theme";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";

interface DatePickerProps {
  label?: string;

  value?: Date;

  placeholder?: string;

  error?: string;

  minimumDate?: Date;

  maximumDate?: Date;

  onChange: (date: Date) => void;
}

export function DatePicker({
  label,
  value,
  placeholder = "Select date",
  error,
  minimumDate,
  maximumDate,
  onChange,
}: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  function handleChange(event: DateTimePickerEvent, selectedDate?: Date) {
    setShowPicker(false);

    if (selectedDate) {
      onChange(selectedDate);
    }
  }

  const formattedDate = value
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(value)
    : placeholder;

  return (
    <View style={styles.container}>
      {label && (
        <AppText variant="caption" color="secondary" style={styles.label}>
          {label}
        </AppText>
      )}

      <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
        <AppText
          variant="body"
          style={{
            color: value ? theme.input.text : theme.input.placeholder,
          }}
        >
          {formattedDate}
        </AppText>

        <Ionicons name="calendar-outline" size={20} color={theme.input.icon} />
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={handleChange}
        />
      )}

      {error && (
        <AppText variant="caption" color="error" style={styles.error}>
          {error}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  label: {
    marginBottom: 8,
  },

  input: {
    height: 48,

    borderWidth: 1,
    borderColor: theme.input.border,

    borderRadius: radius.md,

    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: theme.input.background,
  },

  error: {
    marginTop: 4,
  },

  value: {
    ...typography.body,
  },
});
