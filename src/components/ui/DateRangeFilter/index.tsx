import { useState } from "react";

import { Calendar, DateData } from "react-native-calendars";

import { View } from "react-native";

import { spacing, theme } from "@/theme";

import { DateField } from "@/components/ui/DateField";

import type { DateRange } from "@/types/orderFilters";

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

type CalendarMarkedDate = {
  color?: string;
  textColor?: string;
  startingDay?: boolean;
  endingDay?: boolean;
};

const formatCalendarDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const [activeField, setActiveField] = useState<"start" | "end">("start");

  const handleDateSelect = (day: DateData) => {
    const selectedDate = new Date(day.timestamp);

    if (activeField === "start") {
      const start = selectedDate;

      const end = value.end && value.end < start ? start : value.end;

      onChange({
        start,
        end,
      });

      setActiveField("end");

      return;
    }

    const end = selectedDate;

    const start = value.start && value.start > end ? end : value.start;

    onChange({
      start,
      end,
    });

    setActiveField("start");
  };

  const getMarkedDates = () => {
    const markedDates: Record<string, CalendarMarkedDate> = {};

    if (!value.start) {
      return markedDates;
    }

    const start = new Date(value.start);

    const end = value.end ? new Date(value.end) : new Date(value.start);

    const current = new Date(start);

    while (current <= end) {
      const date = formatCalendarDate(current);

      markedDates[date] = {
        color: theme.action.primary.background,
        textColor: theme.action.primary.text,
      };

      current.setDate(current.getDate() + 1);
    }

    const startDate = formatCalendarDate(start);

    markedDates[startDate] = {
      ...markedDates[startDate],
      startingDay: true,
    };

    const endDate = formatCalendarDate(end);

    markedDates[endDate] = {
      ...markedDates[endDate],
      endingDay: true,
    };

    return markedDates;
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
        isActive={activeField === "start"}
        onPress={() => {
          setActiveField("start");
        }}
      />

      <DateField
        label="To"
        value={value.end}
        isActive={activeField === "end"}
        onPress={() => {
          setActiveField("end");
        }}
      />

      <Calendar
        markingType="period"
        onDayPress={handleDateSelect}
        markedDates={getMarkedDates()}
        theme={{
          backgroundColor: theme.background.surface,
          calendarBackground: theme.background.surface,

          textSectionTitleColor: theme.text.secondary,

          monthTextColor: theme.text.heading,

          dayTextColor: theme.text.primary,

          todayTextColor: theme.action.primary.background,

          arrowColor: theme.action.primary.background,

          selectedDayBackgroundColor: theme.action.primary.background,

          selectedDayTextColor: theme.action.primary.text,

          textDisabledColor: theme.text.placeholder,

          dotColor: theme.action.primary.background,

          indicatorColor: theme.action.primary.background,

          textDayFontWeight: "500",
          textMonthFontWeight: "700",
          textDayHeaderFontWeight: "600",

          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 13,
        }}
      />
    </View>
  );
}
