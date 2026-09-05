import { useState } from "react";

import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";

import { Card } from "@/components/ui/Card";

import { ToggleSwitch } from "@/components/ui/ToggleSwitch";

import { useSettlementAccounts } from "@/hooks/merchant/useSettlementAccounts";

import { radius, spacing, theme } from "@/theme";

/**
 * ============================================================================
 * TYPES
 * ============================================================================
 */

type IDType = "Myself" | "Customers";

/**
 * ============================================================================
 * PAYMENT SETTINGS SCREEN
 * ============================================================================
 */

export default function PaymentSettingsScreen() {
  /**
   * =========================================================================
   * PAYMENT SETTINGS STATE
   * =========================================================================
   */

  const [idType, setIdType] = useState<IDType>("Myself");

  const [cardsEnabled, setCardsEnabled] = useState(true);

  const [ussdEnabled, setUssdEnabled] = useState(true);

  const [bankEnabled, setBankEnabled] = useState(true);

  const [bankTransferEnabled, setBankTransferEnabled] = useState(true);

  const [nqrEnabled, setNqrEnabled] = useState(true);

  /**
   * =========================================================================
   * REFRESH STATE
   * =========================================================================
   */

  const [refreshing, setRefreshing] = useState(false);

  /**
   * =========================================================================
   * SETTLEMENT ACCOUNT STATUS
   * =========================================================================
   *
   * Payment settings can only be configured after the merchant
   * has added a settlement account.
   */

  const {
    settlementAccounts,
    isLoading: settlementAccountsLoading,
    refetch: refetchSettlementAccounts,
  } = useSettlementAccounts();

  const hasSettlementAccount = (settlementAccounts?.length ?? 0) > 0;

  /**
   * =========================================================================
   * PAYMENT SETTINGS ACCESS
   * =========================================================================
   *
   * The merchant can configure payment settings only when:
   *
   * - Settlement accounts have finished loading
   * - At least one settlement account exists
   */

  const canConfigurePaymentSettings =
    !settlementAccountsLoading && hasSettlementAccount;

  /**
   * =========================================================================
   * REFRESH
   * =========================================================================
   */

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      /**
       * Refresh settlement account status.
       *
       * Once payment settings APIs are integrated,
       * add their refetch calls here as well.
       */

      await refetchSettlementAccounts();
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * =========================================================================
   * UI
   * =========================================================================
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
            paddingBottom: spacing.md,
          }}
        >
          {/* BACK BUTTON */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
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

          {/* TITLE */}

          <View
            style={{
              flex: 1,
              gap: spacing.xs,
            }}
          >
            <AppText variant="h1">Payment Settings</AppText>

            <AppText variant="body" color="secondary">
              Configure payment methods, settlement preferences, and checkout
              options.
            </AppText>
          </View>
        </View>

        {/* ================================================================
            CONTENT
        ================================================================ */}

        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            paddingBottom: spacing.xl,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.action.primary.background}
              colors={[theme.action.primary.background]}
            />
          }
        >
          {/* ==============================================================
              SETTLEMENT ACCOUNT REQUIRED
          ============================================================== */}

          {!settlementAccountsLoading && !hasSettlementAccount && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add settlement account"
              onPress={() => router.push("/(tabs)/more/settlements")}
              style={({ pressed }) => ({
                marginTop: spacing.sm,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.md,
                borderRadius: radius.md,
                backgroundColor: theme.background.warning,
                borderWidth: 1,
                borderColor: theme.border.warning,
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={theme.icon.warning.icon}
              />

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodySmall" color="warning">
                  Settlement account required
                </AppText>

                <AppText variant="caption" color="muted">
                  Add a settlement account before configuring your payment
                  methods.
                </AppText>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.icon.warning.icon}
              />
            </Pressable>
          )}

          {/* ==============================================================
              TRANSACTION CHARGES
          ============================================================== */}

          <Card
            style={{
              marginTop: spacing.md,
              gap: spacing.md,

              /**
               * Visual locked state.
               */

              opacity: canConfigurePaymentSettings ? 1 : 0.6,
            }}
            variant="description"
          >
            {/* ============================================================
                HEADER
            ============================================================ */}

            <View
              style={{
                gap: spacing.xs,
              }}
            >
              <AppText variant="bodyLargeBold">Transaction Charges</AppText>

              <AppText variant="body" color="muted">
                You decide who pays the transaction fees for your business.
              </AppText>
            </View>

            {/* ============================================================
                CHARGE BEARER
            ============================================================ */}

            <View
              style={{
                gap: spacing.sm,
              }}
            >
              <AppText variant="bodySmall" color="secondary">
                Charges paid by
              </AppText>

              <ToggleSwitch
                value={idType}
                fullWidth
                options={[
                  {
                    label: "Myself",
                    value: "Myself",
                    disabled: !canConfigurePaymentSettings,
                  },
                  {
                    label: "Customers",
                    value: "Customers",
                    disabled: !canConfigurePaymentSettings,
                  },
                ]}
                onChange={(value) => {
                  if (
                    canConfigurePaymentSettings &&
                    (value === "Myself" || value === "Customers")
                  ) {
                    setIdType(value);
                  }
                }}
              />
            </View>

            {/* ============================================================
                SELECTION DESCRIPTION
            ============================================================ */}

            <View
              style={{
                alignItems: "center",
                paddingTop: spacing.xs,
              }}
            >
              <AppText
                variant="bodySmall"
                color="muted"
                style={{
                  textAlign: "center",
                }}
              >
                {idType === "Myself"
                  ? "You will cover all transaction fees."
                  : "Your customers will cover all transaction fees."}
              </AppText>
            </View>
          </Card>

          {/* ==============================================================
              PAYMENT METHODS HEADER
          ============================================================== */}

          <View
            style={{
              marginTop: spacing.xl,
              gap: spacing.xs,

              opacity: canConfigurePaymentSettings ? 1 : 0.6,
            }}
          >
            <AppText variant="bodyLargeBold">Payment Methods</AppText>

            <AppText variant="bodySmall" color="muted">
              Choose which payment methods your customers can use.
            </AppText>
          </View>

          {/* ==============================================================
              PAYMENT METHODS
          ============================================================== */}

          <Card
            style={{
              marginTop: spacing.md,
              paddingVertical: spacing.sm,
              opacity: canConfigurePaymentSettings ? 1 : 0.6,
            }}
          >
            {/* ============================================================
                CARDS
            ============================================================ */}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
                paddingVertical: spacing.sm,
              }}
            >
              {/* ICON */}

              <Image
                source={require("../../../../assets/payment-settings/cardIcon.png")}
                style={{
                  width: 48,
                  height: 48,
                }}
                resizeMode="contain"
              />

              {/* CONTENT */}

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: spacing.sm,
                  }}
                >
                  <AppText variant="bodyLargeBold">Cards</AppText>

                  <View
                    style={{
                      paddingHorizontal: spacing.sm,
                      paddingVertical: 3,
                      borderRadius: radius.full,
                      backgroundColor: theme.background.brand,
                    }}
                  >
                    <AppText variant="caption" color="brand">
                      1.5% Flat Fee
                    </AppText>
                  </View>
                </View>

                <AppText variant="bodySmall" color="muted">
                  Accept card payments from your customers.
                </AppText>
              </View>

              {/* ACTION */}

              <ToggleSwitch
                value={cardsEnabled}
                onChange={setCardsEnabled}
                disabled={!canConfigurePaymentSettings}
              />
            </View>

            {/* DIVIDER */}

            <View
              style={{
                height: 1,
                backgroundColor: theme.divider.subtle,
                marginVertical: spacing.xs,
                marginLeft: 48 + spacing.md,
              }}
            />

            {/* ============================================================
                USSD
            ============================================================ */}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
                paddingVertical: spacing.sm,
              }}
            >
              {/* ICON */}

              <Image
                source={require("../../../../assets/payment-settings/ussdIcon.png")}
                style={{
                  width: 48,
                  height: 48,
                }}
                resizeMode="contain"
              />

              {/* CONTENT */}

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: spacing.sm,
                  }}
                >
                  <AppText variant="bodyLargeBold">USSD</AppText>

                  <View
                    style={{
                      paddingHorizontal: spacing.sm,
                      paddingVertical: 3,
                      borderRadius: radius.full,
                      backgroundColor: theme.background.brand,
                    }}
                  >
                    <AppText variant="caption" color="brand">
                      1.5% Flat Fee
                    </AppText>
                  </View>
                </View>

                <AppText variant="bodySmall" color="muted">
                  Accept payments through USSD.
                </AppText>
              </View>

              {/* ACTION */}

              <ToggleSwitch
                value={ussdEnabled}
                onChange={setUssdEnabled}
                disabled={!canConfigurePaymentSettings}
              />
            </View>

            {/* DIVIDER */}

            <View
              style={{
                height: 1,
                backgroundColor: theme.divider.subtle,
                marginVertical: spacing.xs,
                marginLeft: 48 + spacing.md,
              }}
            />

            {/* ============================================================
                BANK
            ============================================================ */}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
                paddingVertical: spacing.sm,
              }}
            >
              {/* ICON */}

              <Image
                source={require("../../../../assets/payment-settings/bankIcon.png")}
                style={{
                  width: 48,
                  height: 48,
                }}
                resizeMode="contain"
              />

              {/* CONTENT */}

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: spacing.sm,
                  }}
                >
                  <AppText variant="bodyLargeBold">Bank</AppText>

                  <View
                    style={{
                      paddingHorizontal: spacing.sm,
                      paddingVertical: 3,
                      borderRadius: radius.full,
                      backgroundColor: theme.background.brand,
                    }}
                  >
                    <AppText variant="caption" color="brand">
                      1.5% Flat Fee
                    </AppText>
                  </View>
                </View>

                <AppText variant="bodySmall" color="muted">
                  Accept payments directly through bank channels.
                </AppText>
              </View>

              {/* ACTION */}

              <ToggleSwitch
                value={bankEnabled}
                onChange={setBankEnabled}
                disabled={!canConfigurePaymentSettings}
              />
            </View>

            {/* DIVIDER */}

            <View
              style={{
                height: 1,
                backgroundColor: theme.divider.subtle,
                marginVertical: spacing.xs,
                marginLeft: 48 + spacing.md,
              }}
            />

            {/* ============================================================
                BANK TRANSFER
            ============================================================ */}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
                paddingVertical: spacing.sm,
              }}
            >
              {/* ICON */}

              <Image
                source={require("../../../../assets/payment-settings/bankTransferIcon.png")}
                style={{
                  width: 48,
                  height: 48,
                }}
                resizeMode="contain"
              />

              {/* CONTENT */}

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: spacing.sm,
                  }}
                >
                  <AppText variant="bodyLargeBold">Transfer</AppText>

                  <View
                    style={{
                      paddingHorizontal: spacing.sm,
                      paddingVertical: 3,
                      borderRadius: radius.full,
                      backgroundColor: theme.background.brand,
                    }}
                  >
                    <AppText variant="caption" color="brand">
                      1.5% Flat Fee
                    </AppText>
                  </View>
                </View>

                <AppText variant="bodySmall" color="muted">
                  Accept payments through bank transfers.
                </AppText>
              </View>

              {/* ACTION */}

              <ToggleSwitch
                value={bankTransferEnabled}
                onChange={setBankTransferEnabled}
                disabled={!canConfigurePaymentSettings}
              />
            </View>

            {/* DIVIDER */}

            <View
              style={{
                height: 1,
                backgroundColor: theme.divider.subtle,
                marginVertical: spacing.xs,
                marginLeft: 48 + spacing.md,
              }}
            />

            {/* ============================================================
                NQR
            ============================================================ */}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
                paddingVertical: spacing.sm,
              }}
            >
              {/* ICON */}

              <Image
                source={require("../../../../assets/payment-settings/nqrIcon.png")}
                style={{
                  width: 48,
                  height: 48,
                }}
                resizeMode="contain"
              />

              {/* CONTENT */}

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: spacing.sm,
                  }}
                >
                  <AppText variant="bodyLargeBold">NQR</AppText>

                  <View
                    style={{
                      paddingHorizontal: spacing.sm,
                      paddingVertical: 3,
                      borderRadius: radius.full,
                      backgroundColor: theme.background.brand,
                    }}
                  >
                    <AppText variant="caption" color="brand">
                      1.5% Flat Fee
                    </AppText>
                  </View>
                </View>

                <AppText variant="bodySmall" color="muted">
                  Accept payments using QR codes.
                </AppText>
              </View>

              {/* ACTION */}

              <ToggleSwitch
                value={nqrEnabled}
                onChange={setNqrEnabled}
                disabled={!canConfigurePaymentSettings}
              />
            </View>
          </Card>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
