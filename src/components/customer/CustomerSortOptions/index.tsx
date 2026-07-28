import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import type { CustomerSort } from "@/types/customer-sort";


interface CustomerSortOptionsProps {
  value: CustomerSort;
  onChange: (value: CustomerSort) => void;
}

const options: {
  label: string;
  value: CustomerSort;
}[] = [
  {
    label: "First Name (A–Z)",
    value: "firstNameAsc",
  },
  {
    label: "First Name (Z–A)",
    value: "firstNameDesc",
  },
  {
    label: "Highest Spending",
    value: "highestSpent",
  },
  {
    label: "Lowest Spending",
    value: "lowestSpent",
  },
  {
    label: "Most Orders",
    value: "mostOrders",
  },
  {
    label: "Least Orders",
    value: "leastOrders",
  },
];

export function CustomerSortOptions({
  value,
  onChange,
}: CustomerSortOptionsProps) {
  return (
    <View
      style={{
        gap: spacing.sm,
      }}
    >
      {options.map((option) => {
        const selected = value === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: spacing.md,
            }}
          >
            <AppText
              variant="bodyLarge"
              color={selected ? "primary" : "secondary"}
            >
              {option.label}
            </AppText>

            {selected && (
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={theme.icon.success.icon}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}