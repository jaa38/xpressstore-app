import { useState } from "react";

import { View, Pressable } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Input } from "@/components/ui/Input";
import { AppText } from "@/components/ui/AppText";

import { spacing } from "@/theme";

import { StyleSheet } from "react-native";

import { theme } from "@/theme";
import { radius } from "@/theme/radius";

const DEFAULT_CURRENCIES = [
  {
    label: "₦",
    value: "NGN",
  },
  {
    label: "$",
    value: "USD",
  },
  {
    label: "£",
    value: "GBP",
  },
  {
    label: "€",
    value: "EUR",
  },
];

interface CurrencyInputProps {
  label?: string;
  required?: boolean;
  optional?: boolean;
  value?: string;
  placeholder?: string;
  defaultCurrency?: string;
  onChangeText?: (value: string) => void;
  onCurrencyChange?: (currency: string) => void;
}

export function CurrencyInput({
  label = "Amount",
  required = false,
  optional = false,
  value,
  placeholder = "0.00",
  defaultCurrency = "NGN",
  onChangeText,
  onCurrencyChange,
}: CurrencyInputProps) {
  const [currency, setCurrency] = useState(defaultCurrency);

  const [showCurrencies, setShowCurrencies] = useState(false);

  const selectedCurrency = DEFAULT_CURRENCIES.find(
    (item) => item.value === currency
  );

  if (!selectedCurrency) {
    return null;
  }

  function handleCurrencyChange(currencyValue: string) {
    setCurrency(currencyValue);

    onCurrencyChange?.(currencyValue);
  }

  return (
    <View>
      <Input
        label={label}
        required={required}
        optional={optional}
        placeholder={placeholder}
        keyboardType="decimal-pad"
        value={value}
        onChangeText={onChangeText}
        leftElement={
          <Pressable
            onPress={() => setShowCurrencies(!showCurrencies)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 16,
              paddingRight: 12,
              gap: 4,
            }}
          >
            <AppText variant="body">{selectedCurrency.label}</AppText>

            <Ionicons
              name={showCurrencies ? "chevron-up" : "chevron-down"}
              size={16}
            />
          </Pressable>
        }
      />

      {showCurrencies && (
        <View style={styles.optionsContainer}>
          {DEFAULT_CURRENCIES.map((item) => (
            <Pressable
              key={item.value}
              onPress={() => {
                handleCurrencyChange(item.value);

                setShowCurrencies(false);
              }}
              style={[
                styles.option,

                currency === item.value && {
                  backgroundColor: theme.background.brand,
                },
              ]}
            >
              <AppText variant="body">
                {item.label} {item.value}
              </AppText>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    marginTop: spacing.xs,

    maxHeight: 220,

    borderWidth: 1,

    borderColor: theme.input.border,

    borderRadius: radius.md,

    backgroundColor: "#FFFFFF",

    overflow: "hidden",
  },

  option: {
    paddingHorizontal: 16,

    paddingVertical: 14,

    backgroundColor: "#FFFFFF",
  },
});
