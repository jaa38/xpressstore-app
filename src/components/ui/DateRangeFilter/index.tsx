import { useState } from "react";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { View } from "react-native";

import { spacing } from "@/theme";

import { DateField } from "@/components/ui/DateField";

import type { DateRange } from "@/types/orderFilters";

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

export function DateRangeFilter({
  value,
  onChange,
}: DateRangeFilterProps) {
  const [activePicker, setActivePicker] = useState<
    "start" | "end" | null
  >(null);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setActivePicker(null);

    if (!selectedDate) {
      return;
    }

    if (activePicker === "start") {
      const start = selectedDate;

      const end =
        value.end && value.end < start
          ? start
          : value.end;

      onChange({
        start,
        end,
      });
    }

    if (activePicker === "end") {
      const end = selectedDate;

      const start =
        value.start && value.start > end
          ? end
          : value.start;

      onChange({
        start,
        end,
      });
    }
  };

  return (
    <View
      style={{
        gap: spacing.md,
      }}
    >
      <DateField
        label="From"
        value={value.start}
        onPress={() => {
          setActivePicker("start");
        }}
      />

      <DateField
        label="To"
        value={value.end}
        onPress={() => {
          setActivePicker("end");
        }}
      />

      {activePicker && (
        <DateTimePicker
          value={
            activePicker === "start"
              ? value.start ?? new Date()
              : value.end ?? new Date()
          }
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}