import { Modal, Pressable, ScrollView, Switch, View } from "react-native";

import { useEffect, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";

import { spacing, theme, radius } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import * as SecureStore from "expo-secure-store";

import { CURRENCIES, type CurrencyOption } from "@/constants/currencies";

import type { Currency } from "@/types/currency";

/**
 * ============================================================================
 * SETTINGS STORAGE
 * ============================================================================
 */

const SETTINGS_STORAGE_KEY = "xpressstore_app_settings";

type AppSettings = {
  darkMode: boolean;
  defaultCurrency: Currency;
};

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  defaultCurrency: "NGN",
};

/**
 * ============================================================================
 * SETTINGS SCREEN
 * ============================================================================
 */

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(DEFAULT_SETTINGS.darkMode);

  const [defaultCurrency, setDefaultCurrency] = useState<Currency>(
    DEFAULT_SETTINGS.defaultCurrency
  );

  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);

  /**
   * ==========================================================================
   * LOAD SETTINGS
   * ==========================================================================
   */

  useEffect(() => {
    async function loadSettings() {
      try {
        const storedSettings =
          await SecureStore.getItemAsync(SETTINGS_STORAGE_KEY);

        if (!storedSettings) {
          return;
        }

        const parsedSettings = JSON.parse(
          storedSettings
        ) as Partial<AppSettings>;

        setDarkMode(parsedSettings.darkMode ?? DEFAULT_SETTINGS.darkMode);

        setDefaultCurrency(
          parsedSettings.defaultCurrency ?? DEFAULT_SETTINGS.defaultCurrency
        );
      } catch (error) {
        console.error("Unable to load app settings:", error);
      }
    }

    void loadSettings();
  }, []);

  /**
   * ==========================================================================
   * SAVE SETTINGS
   * ==========================================================================
   */

  async function saveSettings(updates: Partial<AppSettings>) {
    try {
      const currentSettings: AppSettings = {
        darkMode,
        defaultCurrency,
        ...updates,
      };

      await SecureStore.setItemAsync(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(currentSettings)
      );
    } catch (error) {
      console.error("Unable to save app settings:", error);
    }
  }

  /**
   * ==========================================================================
   * DARK MODE
   * ==========================================================================
   */

  async function handleDarkModeChange(value: boolean) {
    setDarkMode(value);

    await saveSettings({
      darkMode: value,
    });
  }

  /**
   * ==========================================================================
   * DEFAULT CURRENCY
   * ==========================================================================
   */

  async function handleCurrencyChange(currency: Currency) {
    setDefaultCurrency(currency);
    setIsCurrencyModalVisible(false);

    await saveSettings({
      defaultCurrency: currency,
    });
  }

  /**
   * ==========================================================================
   * SELECTED CURRENCY
   * ==========================================================================
   */

  const selectedCurrency: CurrencyOption =
    CURRENCIES.find((currency) => currency.value === defaultCurrency) ??
    CURRENCIES[0]!;

  /**
   * ==========================================================================
   * RENDER
   * ==========================================================================
   */

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
    >
      <StatusBar style="auto" />

      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.lg,
        }}
      >
        {/* ================================================================
            HEADER
        ================================================================ */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
                return;
              }

              router.replace(ROUTES.MORE);
            }}
            style={{
              width: 44,
              height: 44,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.text.primary}
            />
          </Pressable>

          <View
            style={{
              flex: 1,
              gap: spacing.xs,
            }}
          >
            <AppText variant="h1">Settings</AppText>

            <AppText variant="bodySmall" color="secondary">
              Manage your app preferences.
            </AppText>
          </View>
        </View>

        {/* ================================================================
            CONTENT
        ================================================================ */}

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: spacing.lg,
            paddingBottom: spacing.xl,
            gap: spacing.lg,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* ==============================================================
              APPEARANCE
          ============================================================== */}

          <View style={{ gap: spacing.sm }}>
            <AppText variant="bodyLargeBold">Appearance</AppText>

            <Card>
              <View style={{ gap: spacing.md }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.md,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: radius.full,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: theme.icon.default.background,
                    }}
                  >
                    <Ionicons
                      name={darkMode ? "moon" : "moon-outline"}
                      size={24}
                      color={theme.icon.default.icon}
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                      gap: spacing.xs,
                    }}
                  >
                    <AppText variant="bodyBold">Dark Mode</AppText>

                    <AppText variant="bodySmall" color="muted">
                      Use a darker appearance throughout XpressStore.
                    </AppText>
                  </View>

                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "center",
                    }}
                  >
                    <Switch
                      accessibilityRole="switch"
                      accessibilityLabel="Dark Mode"
                      accessibilityState={{
                        checked: darkMode,
                      }}
                      value={darkMode}
                      onValueChange={handleDarkModeChange}
                      trackColor={{
                        false: theme.border.strong,
                        true: theme.toggleSwitch.active,
                      }}
                      thumbColor={theme.background.surface}
                      ios_backgroundColor={theme.border.strong}
                    />
                  </View>
                </View>
              </View>
            </Card>
          </View>

          {/* ==============================================================
              CURRENCY
          ============================================================== */}

          <View style={{ gap: spacing.sm }}>
            <AppText variant="bodyLargeBold">Currency</AppText>

            <Card>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Select default currency"
                accessibilityHint="Opens the default currency selector"
                onPress={() => setIsCurrencyModalVisible(true)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: radius.full,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: theme.icon.branding.background,
                  }}
                >
                  <AppText variant="bodyLargeBold" color="brand">
                    {selectedCurrency.label}
                  </AppText>
                </View>

                <View
                  style={{
                    flex: 1,
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodyBold">Default Currency</AppText>

                  <AppText variant="bodySmall" color="muted">
                    Used when displaying default amounts in XpressStore.
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>
            </Card>
          </View>

          {/* ==============================================================
              INFORMATION
          ============================================================== */}

          <Card
            style={{
              backgroundColor: theme.background.subtle,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: spacing.md,
              }}
            >
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={theme.icon.default.icon}
              />

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodyBold">App preferences</AppText>

                <AppText variant="bodySmall" color="secondary">
                  Your preferences are saved on this device and can be changed
                  at any time.
                </AppText>
              </View>
            </View>
          </Card>
        </ScrollView>
      </View>

      {/* ====================================================================
          CURRENCY MODAL
      ==================================================================== */}

      <Modal
        visible={isCurrencyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsCurrencyModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: theme.overlay.background,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close currency selector"
            onPress={() => setIsCurrencyModalVisible(false)}
            style={{
              flex: 1,
            }}
          />

          <View
            style={{
              backgroundColor: theme.background.surface,
              borderTopLeftRadius: radius.lg,
              borderTopRightRadius: radius.lg,
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.lg,
              paddingBottom: spacing.xl,
            }}
          >
            {/* ============================================================
                MODAL HEADER
            ============================================================ */}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
                marginBottom: spacing.lg,
              }}
            >
              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <AppText variant="h3">Default Currency</AppText>

                <AppText variant="bodySmall" color="secondary">
                  Select the currency used for default amounts.
                </AppText>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={() => setIsCurrencyModalVisible(false)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: radius.full,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: theme.icon.default.background,
                }}
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={theme.icon.default.icon}
                />
              </Pressable>
            </View>

            <Divider variant="subtle" />

            {/* ============================================================
                CURRENCY OPTIONS
            ============================================================ */}

            <View
              style={{
                marginTop: spacing.md,
                gap: spacing.xs,
              }}
            >
              {CURRENCIES.map((currency) => {
                const isSelected = currency.value === defaultCurrency;

                return (
                  <Pressable
                    key={currency.value}
                    accessibilityRole="radio"
                    accessibilityLabel={`${currency.value} currency`}
                    accessibilityState={{
                      checked: isSelected,
                    }}
                    onPress={() => handleCurrencyChange(currency.value)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: spacing.md,
                      paddingVertical: spacing.md,
                      paddingHorizontal: spacing.md,
                      borderRadius: radius.md,
                      backgroundColor: isSelected
                        ? theme.listItem.selected.background
                        : theme.listItem.default.background,
                    }}
                  >
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: radius.full,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: isSelected
                          ? theme.icon.branding.background
                          : theme.icon.default.background,
                      }}
                    >
                      <AppText
                        variant="bodyLargeBold"
                        color={isSelected ? "brand" : "primary"}
                      >
                        {currency.label}
                      </AppText>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        gap: spacing.xs,
                      }}
                    >
                      <AppText
                        variant="bodyBold"
                        color={isSelected ? "brand" : "primary"}
                      >
                        {currency.value}
                      </AppText>

                      <AppText variant="bodySmall" color="muted">
                        {currency.value === "NGN"
                          ? "Nigerian Naira"
                          : currency.value === "USD"
                            ? "US Dollar"
                            : currency.value === "GBP"
                              ? "British Pound"
                              : "Euro"}
                      </AppText>
                    </View>

                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={theme.icon.branding.icon}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
