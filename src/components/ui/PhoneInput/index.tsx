import { useState } from "react";

import { View, TextInput, Pressable, StyleSheet } from "react-native";

import CountryPicker, { Country } from "react-native-country-picker-modal";

import { AppText } from "@/components/ui/AppText";

import { radius, theme } from "@/theme";

import { Ionicons } from "@expo/vector-icons";

interface PhoneNumberInputProps {
  label?: string;

  value: string;

  onChangeText: (value: string) => void;

  countryCode: string;

  onCountryCodeChange: (countryCode: string) => void;

  error?: string;
}

export function PhoneNumberInput({
  label,
  value,
  onChangeText,
  countryCode,
  onCountryCodeChange,
  error,
}: PhoneNumberInputProps) {
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);

  const [country, setCountry] = useState<Country>({
    cca2: "NG",
    callingCode: ["234"],
    flag: "🇳🇬",
  } as Country);

  function handleCountrySelect(selectedCountry: Country) {
    setCountry(selectedCountry);

    onCountryCodeChange(selectedCountry.cca2);
  }

  return (
    <View>
      {label && (
        <AppText
          variant="caption"
          color="secondary"
          style={{
            marginBottom: 8,
          }}
        >
          {label}
        </AppText>
      )}

      <View style={styles.container}>
        <Pressable
          style={styles.countryPicker}
          onPress={() => setCountryPickerVisible(true)}
        >
          <CountryPicker
            visible={countryPickerVisible}
            withFilter
            withFlag
            withCallingCode
            withEmoji
            countryCode={country?.cca2 ?? "NG"}
            onSelect={handleCountrySelect}
            onClose={() => setCountryPickerVisible(false)}
          />

          <AppText variant="body">+{country.callingCode[0]}</AppText>
        </Pressable>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          placeholder="8012345678"
          style={styles.input}
        />
      </View>

      {error && (
        <AppText
          variant="caption"
          color="error"
          style={{
            marginTop: 4,
          }}
        >
          {error}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",

    gap: 8,
  },

  countryPicker: {
    width: 110,

    height: 48,

    borderWidth: 1,

    borderColor: theme.input.border,

    borderRadius: radius.md,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 6,

    backgroundColor: theme.input.background,
  },

  input: {
    flex: 1,

    height: 48,

    borderWidth: 1,

    borderColor: theme.input.border,

    borderRadius: radius.md,

    paddingHorizontal: 16,

    backgroundColor: theme.input.background,

    color: theme.input.text,
  },
});
