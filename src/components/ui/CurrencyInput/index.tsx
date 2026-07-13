import { useState } from "react";
import type { Currency } from "@/types/product";
import { CURRENCIES } from "@/constants/currencies";

import { View, Pressable, KeyboardTypeOptions } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Input } from "@/components/ui/Input";
import { AppText } from "@/components/ui/AppText";

import { spacing } from "@/theme";

import { StyleSheet } from "react-native";

import { theme } from "@/theme";
import { radius } from "@/theme/radius";

interface CurrencyInputProps {
  label?: string;
  required?: boolean;
  optional?: boolean;

  value?: string;

  placeholder?: string;

  defaultCurrency?: Currency;

  currency?: Currency;

  disableCurrencySelection?: boolean;

  error?: string;

  keyboardType?: KeyboardTypeOptions;

  onChangeText?: (value: string) => void;

  onCurrencyChange?: (currency: Currency) => void;
}

export function CurrencyInput({
  label = "Amount",
  required = false,
  optional = false,
  value,
  placeholder = "0.00",
  defaultCurrency = "NGN",

  currency,
  disableCurrencySelection = false,

  keyboardType = "decimal-pad",
  error,

  onChangeText,
  onCurrencyChange,
}: CurrencyInputProps) {
  const [internalCurrency, setInternalCurrency] = useState(defaultCurrency);

  const selectedCurrencyValue = currency ?? internalCurrency;

  const [showCurrencies, setShowCurrencies] = useState(false);

  const selectedCurrency = CURRENCIES.find(
    (item) => item.value === selectedCurrencyValue
  );

  if (!selectedCurrency) {
    return null;
  }

  function handleCurrencyChange(currencyValue: Currency) {
    setInternalCurrency(currencyValue);

    onCurrencyChange?.(currencyValue);
  }

  function handleAmountChange(text: string) {
    const sanitized = text.replace(/[^0-9.]/g, "");

    const decimalCount = sanitized.split(".").length - 1;

    if (decimalCount > 1) {
      return;
    }

    onChangeText?.(sanitized);
  }

  return (
    <View>
      <Input
        label={label}
        required={required}
        optional={optional}
        placeholder={placeholder}
        keyboardType={keyboardType}
        value={value}
        onChangeText={handleAmountChange}
        error={error}
        leftElement={
          <Pressable
            disabled={disableCurrencySelection}
            onPress={() => {
              if (!disableCurrencySelection) {
                setShowCurrencies(!showCurrencies);
              }
            }}
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

      {showCurrencies && !disableCurrencySelection && (
        <View style={styles.optionsContainer}>
          {CURRENCIES.map((item) => (
            <Pressable
              key={item.value}
              onPress={() => {
                handleCurrencyChange(item.value);

                setShowCurrencies(false);
              }}
              style={[
                styles.option,

                selectedCurrencyValue === item.value && {
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
