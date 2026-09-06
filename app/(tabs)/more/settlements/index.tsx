import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { useEffect, useRef, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { Controller, useForm } from "react-hook-form";

import { AppText } from "@/components/ui/AppText";

import { Input } from "@/components/ui/Input";

import { Button } from "@/components/ui/Button";

import { Dropdown } from "@/components/ui/Dropdown";

import { spacing, theme, radius } from "@/theme";

import { useOnboardingStore } from "@/store/onboarding/onboardingStore";

import { useVerifyBVN } from "@/hooks/kyc/useVerifyBVN";

import { getApiErrorMessage } from "@/api/errors";

import { useValidateSettlementAccount } from "@/hooks/merchant/useValidateSettlementAccount";

import { useUpdateSettlementAccount } from "@/hooks/merchant/useUpdateSettlementAccount";

import { ROUTES } from "@/navigation/routes";

/**
 * ============================================================================
 * TYPES
 * ============================================================================
 */

type SettlementForm = {
  bvn: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
};

type AccountResolutionStatus = "idle" | "resolving" | "success" | "error";

/**
 * ============================================================================
 * SETTLEMENTS SCREEN
 * ============================================================================
 */

export default function SettlementsScreen() {
  /**
   * --------------------------------------------------------------------------
   * ONBOARDING DATA
   * --------------------------------------------------------------------------
   */

  const { bvn, setBVN, setVerifiedBVN } = useOnboardingStore();

  /**
   * --------------------------------------------------------------------------
   * BVN VERIFICATION
   * --------------------------------------------------------------------------
   */

  const verifyBVN = useVerifyBVN();

  /**
   * --------------------------------------------------------------------------
   * ACCOUNT RESOLUTION
   * --------------------------------------------------------------------------
   */

  const { mutateAsync: validateSettlementAccount } =
    useValidateSettlementAccount();

  /**
   * --------------------------------------------------------------------------
   * SETTLEMENT ACCOUNT UPDATE
   * --------------------------------------------------------------------------
   */

  const updateSettlementAccount = useUpdateSettlementAccount();

  /**
   * --------------------------------------------------------------------------
   * ACCOUNT RESOLUTION UI STATE
   * --------------------------------------------------------------------------
   *
   * This is intentionally kept separately from React Query's mutation state.
   *
   * It controls the complete account verification flow:
   *
   * - idle
   * - debounce + API verification
   * - successful verification
   * - failed verification
   */

  const [accountResolutionStatus, setAccountResolutionStatus] =
    useState<AccountResolutionStatus>("idle");

  const [accountResolutionMessage, setAccountResolutionMessage] = useState("");

  /**
   * --------------------------------------------------------------------------
   * REQUEST TRACKING
   * --------------------------------------------------------------------------
   *
   * Used to prevent an older API response from overwriting
   * a newer account number or bank selection.
   */

  const resolveRequestRef = useRef(0);

  /**
   * --------------------------------------------------------------------------
   * FORM
   * --------------------------------------------------------------------------
   */

  const { control, handleSubmit, watch, setValue } = useForm<SettlementForm>({
    defaultValues: {
      bvn: bvn ?? "",
      bankCode: "",
      accountNumber: "",
      accountName: "",
    },
  });

  const { bvn: enteredBVN, bankCode, accountNumber, accountName } = watch();

  /**
   * --------------------------------------------------------------------------
   * VERIFIED BVN
   * --------------------------------------------------------------------------
   */

  const hasVerifiedBVN = Boolean(bvn);

  /**
   * --------------------------------------------------------------------------
   * SYNC BVN
   * --------------------------------------------------------------------------
   */

  useEffect(() => {
    if (bvn) {
      setValue("bvn", bvn);
    }
  }, [bvn, setValue]);

  /**
   * ==========================================================================
   * AUTOMATIC ACCOUNT RESOLUTION
   * ==========================================================================
   *
   * Flow:
   *
   * 1. Merchant selects a bank.
   * 2. Merchant enters a 10-digit account number.
   * 3. Previous verification is cleared.
   * 4. UI immediately enters the resolving state.
   * 5. Wait briefly for the debounce period.
   * 6. Resolve the account automatically.
   * 7. Display the verified account holder.
   *
   * If either the bank or account number changes,
   * the previous verification becomes invalid immediately.
   */

  useEffect(() => {
    /**
     * Every input change creates a new request version.
     *
     * This prevents stale API responses from updating
     * the current account state.
     */

    resolveRequestRef.current += 1;

    const requestId = resolveRequestRef.current;

    /**
     * Clear the previously resolved account.
     */

    setValue("accountName", "");

    /**
     * Reset account resolution UI.
     */

    setAccountResolutionStatus("idle");

    setAccountResolutionMessage("");

    /**
     * Only resolve when both values are valid.
     */

    const isAccountNumberValid = /^\d{10}$/.test(accountNumber);

    if (!bankCode || !isAccountNumberValid) {
      return;
    }

    /**
     * Immediately show verification feedback.
     *
     * This covers both:
     *
     * - debounce period
     * - API request
     */

    setAccountResolutionStatus("resolving");

    /**
     * Small debounce.
     *
     * Prevents unnecessary requests while the merchant
     * is still entering or editing the account number.
     */

    const timeout = setTimeout(async () => {
      try {
        const response = await validateSettlementAccount({
          bankCode,
          accountNumber,
        });

        /**
         * Ignore stale responses.
         */

        if (requestId !== resolveRequestRef.current) {
          return;
        }

        /**
         * Validate that the API returned an account holder.
         */

        if (!response.data?.accountName?.trim()) {
          setValue("accountName", "");

          setAccountResolutionStatus("error");

          setAccountResolutionMessage(
            response.responseMessage ||
              "We could not verify this account. Check the bank and account number."
          );

          return;
        }

        /**
         * Store the resolved account holder.
         */

        setValue("accountName", response.data.accountName.trim());

        /**
         * Update verification state.
         */

        setAccountResolutionStatus("success");

        setAccountResolutionMessage("");
      } catch (error) {
        /**
         * Ignore stale errors.
         */

        if (requestId !== resolveRequestRef.current) {
          return;
        }

        /**
         * Clear account holder.
         */

        setValue("accountName", "");

        /**
         * Update verification state.
         */

        setAccountResolutionStatus("error");

        /**
         * Store a user-friendly error message.
         */

        setAccountResolutionMessage(getApiErrorMessage(error));
      }
    }, 600);

    return () => {
      clearTimeout(timeout);
    };
  }, [bankCode, accountNumber, validateSettlementAccount, setValue]);

  /**
   * --------------------------------------------------------------------------
   * VALIDATION
   * --------------------------------------------------------------------------
   */

  const isBVNValid = /^\d{11}$/.test(enteredBVN);

  const isAccountNumberValid = /^\d{10}$/.test(accountNumber);

  const isSettlementFormValid =
    hasVerifiedBVN &&
    bankCode.length > 0 &&
    isAccountNumberValid &&
    accountName.trim().length > 0 &&
    accountResolutionStatus === "success";

  /**
   * --------------------------------------------------------------------------
   * BANK OPTIONS
   * --------------------------------------------------------------------------
   */

  const bankOptions = [
    {
      label: "Access Bank",
      value: "044",
    },
    {
      label: "GTBank",
      value: "058",
    },
    {
      label: "First Bank",
      value: "011",
    },
    {
      label: "Zenith Bank",
      value: "057",
    },
    {
      label: "UBA",
      value: "033",
    },
    {
      label: "Opay",
      value: "999992",
    },
    {
      label: "PalmPay",
      value: "999991",
    },
  ];

  /**
   * ==========================================================================
   * VERIFY BVN
   * ==========================================================================
   */

  async function onVerifyBVN() {
    /**
     * Prevent duplicate verification requests.
     */

    if (verifyBVN.isPending) {
      return;
    }

    try {
      if (!isBVNValid) {
        Alert.alert("Invalid BVN", "Please enter a valid 11-digit BVN.");

        return;
      }

      const response = await verifyBVN.mutateAsync({
        bvn: enteredBVN,
      });

      if (!response.data) {
        throw new Error(
          response.responseMessage || "Unable to verify your BVN."
        );
      }

      /**
       * Store verified BVN.
       */

      setBVN(enteredBVN);

      setVerifiedBVN(response.data);

      setValue("bvn", enteredBVN);

      Alert.alert(
        "BVN Verified",
        "Your BVN has been successfully verified. You can now add your settlement account."
      );
    } catch (error) {
      Alert.alert("Verification Failed", getApiErrorMessage(error));
    }
  }

  /**
   * ==========================================================================
   * SAVE SETTLEMENT ACCOUNT
   * ==========================================================================
   */

  async function onSubmit(data: SettlementForm) {
    /**
     * Prevent duplicate save requests.
     */

    if (updateSettlementAccount.isPending) {
      return;
    }

    /**
     * ------------------------------------------------------------------------
     * BVN VALIDATION
     * ------------------------------------------------------------------------
     */

    if (!hasVerifiedBVN) {
      Alert.alert(
        "BVN Verification Required",
        "Please verify your BVN before adding a settlement account."
      );

      return;
    }

    /**
     * ------------------------------------------------------------------------
     * BANK VALIDATION
     * ------------------------------------------------------------------------
     */

    if (!data.bankCode) {
      Alert.alert(
        "Bank Required",
        "Please select the bank for your settlement account."
      );

      return;
    }

    /**
     * ------------------------------------------------------------------------
     * ACCOUNT NUMBER VALIDATION
     * ------------------------------------------------------------------------
     */

    if (!/^\d{10}$/.test(data.accountNumber)) {
      Alert.alert(
        "Invalid Account Number",
        "Please enter a valid 10-digit account number."
      );

      return;
    }

    /**
     * ------------------------------------------------------------------------
     * ACCOUNT VERIFICATION VALIDATION
     * ------------------------------------------------------------------------
     */

    if (accountResolutionStatus !== "success" || !data.accountName.trim()) {
      Alert.alert(
        "Account Verification Required",
        "Please wait for your account details to be successfully verified before saving."
      );

      return;
    }

    /**
     * ------------------------------------------------------------------------
     * BANK LOOKUP
     * ------------------------------------------------------------------------
     */

    const selectedBank = bankOptions.find(
      (bank) => bank.value === data.bankCode
    );

    if (!selectedBank) {
      Alert.alert("Bank Required", "Please select a valid bank.");

      return;
    }

    /**
     * ------------------------------------------------------------------------
     * SAVE ACCOUNT
     * ------------------------------------------------------------------------
     */

    try {
      await updateSettlementAccount.mutateAsync({
        accountNumber: data.accountNumber,

        accountName: data.accountName.trim(),

        bankName: selectedBank.label,

        bankCode: data.bankCode,

        isPrimary: true,
      });

      Alert.alert(
        "Settlement Account Saved",
        "Your settlement account has been successfully saved.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Unable to Save Account", getApiErrorMessage(error));
    }
  }

  /**
   * ==========================================================================
   * UI
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
        {/* ==================================================================
            HEADER
        ================================================================== */}

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
            <AppText variant="h1">Settlement Account</AppText>

            <AppText variant="bodySmall" color="secondary">
              Add your settlement account to receive payments.
            </AppText>
          </View>
        </View>

        {/* ==================================================================
            CONTENT
        ================================================================== */}

        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            paddingTop: spacing.lg,
            paddingBottom: spacing.xl,
            gap: spacing.lg,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ================================================================
              INTRODUCTION
          ================================================================ */}

          <View
            style={{
              gap: spacing.xs,
            }}
          >
            <AppText variant="body" color="secondary">
              Your settlement account is where funds from your transactions will
              be paid.
            </AppText>
          </View>

          {/* ================================================================
              IDENTITY STATUS
          ================================================================ */}

          <View
            style={{
              padding: spacing.md,
              backgroundColor: theme.background.brand,
              borderRadius: radius.md,
              gap: spacing.sm,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              <Ionicons
                name={
                  hasVerifiedBVN
                    ? "shield-checkmark-outline"
                    : "information-circle-outline"
                }
                size={24}
                color={
                  hasVerifiedBVN
                    ? theme.icon.success.icon
                    : theme.icon.default.icon
                }
              />

              <AppText variant="bodyBold">
                {hasVerifiedBVN
                  ? "Verified Identity"
                  : "BVN Verification Required"}
              </AppText>
            </View>

            <AppText variant="bodySmall" color="secondary">
              {hasVerifiedBVN
                ? "Your verified BVN is securely linked to this settlement account."
                : "Please verify your BVN before adding a settlement account."}
            </AppText>
          </View>

          {/* ================================================================
              BVN
          ================================================================ */}

          <View
            style={{
              gap: spacing.md,
            }}
          >
            <Controller
              control={control}
              name="bvn"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="BVN"
                  placeholder="Enter your 11-digit BVN"
                  keyboardType="number-pad"
                  maxLength={11}
                  value={value}
                  onChangeText={(text) => {
                    onChange(text.replace(/\D/g, ""));
                  }}
                  editable={!hasVerifiedBVN}
                  helperText={
                    hasVerifiedBVN
                      ? "Your BVN has been verified and cannot be changed."
                      : "Enter the BVN you want to use for settlements."
                  }
                />
              )}
            />

            {!hasVerifiedBVN && (
              <Button
                title={verifyBVN.isPending ? "Verifying BVN..." : "Verify BVN"}
                variant="primary"
                disabled={!isBVNValid || verifyBVN.isPending}
                onPress={onVerifyBVN}
              />
            )}
          </View>

          {/* ================================================================
              ACCOUNT DETAILS
          ================================================================ */}

          {hasVerifiedBVN && (
            <View
              style={{
                gap: spacing.md,
              }}
            >
              <View
                style={{
                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodyLargeBold">Account Details</AppText>

                <AppText variant="bodySmall" color="secondary">
                  Enter the account where you want to receive settlements.
                </AppText>
              </View>

              {/* ============================================================
                  BANK
              ============================================================ */}

              <Controller
                control={control}
                name="bankCode"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="Bank"
                    placeholder="Select your bank"
                    value={value}
                    options={bankOptions}
                    onSelect={onChange}
                  />
                )}
              />

              {/* ============================================================
                  ACCOUNT NUMBER
              ============================================================ */}

              <Controller
                control={control}
                name="accountNumber"
                render={({ field: { value, onChange } }) => (
                  <Input
                    label="Account Number"
                    placeholder="Enter your 10-digit account number"
                    keyboardType="number-pad"
                    maxLength={10}
                    value={value}
                    onChangeText={(text) => {
                      onChange(text.replace(/\D/g, ""));
                    }}
                    helperText="Your account name will be verified automatically."
                  />
                )}
              />

              {/* ============================================================
                  ACCOUNT RESOLUTION - RESOLVING
              ============================================================ */}

              {accountResolutionStatus === "resolving" && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.sm,

                    padding: spacing.md,

                    backgroundColor: theme.card.default.background,

                    borderWidth: 1,
                    borderColor: theme.card.default.border,

                    borderRadius: radius.md,
                  }}
                >
                  <ActivityIndicator
                    size="small"
                    color={theme.icon.branding.icon}
                  />

                  <View
                    style={{
                      flex: 1,
                      gap: spacing.xs,
                    }}
                  >
                    <AppText variant="bodySmallBold">Verifying account</AppText>

                    <AppText variant="bodySmall" color="secondary">
                      Please wait while we confirm the account holder.
                    </AppText>
                  </View>
                </View>
              )}

              {/* ============================================================
                  ACCOUNT RESOLUTION - SUCCESS
              ============================================================ */}

              {accountResolutionStatus === "success" && accountName && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.sm,

                    padding: spacing.md,

                    backgroundColor: theme.background.brand,

                    borderRadius: radius.md,
                  }}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={theme.icon.success.icon}
                  />

                  <View
                    style={{
                      flex: 1,
                      gap: 2,
                    }}
                  >
                    <AppText variant="bodySmall" color="secondary">
                      Account Holder
                    </AppText>

                    <AppText variant="bodyBold">{accountName}</AppText>
                  </View>
                </View>
              )}

              {/* ============================================================
                  ACCOUNT RESOLUTION - ERROR
              ============================================================ */}

              {accountResolutionStatus === "error" && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: spacing.sm,

                    padding: spacing.md,

                    backgroundColor: theme.card.default.background,

                    borderWidth: 1,
                    borderColor: theme.card.default.border,

                    borderRadius: radius.md,
                  }}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={20}
                    color={theme.text.secondary}
                  />

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <AppText variant="bodySmallBold">
                      Unable to verify account
                    </AppText>

                    <AppText
                      variant="bodySmall"
                      color="secondary"
                      style={{
                        marginTop: spacing.xs,
                      }}
                    >
                      {accountResolutionMessage ||
                        "Check the bank and account number, then try again."}
                    </AppText>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ================================================================
              SECURITY INFORMATION
          ================================================================ */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: spacing.sm,

              padding: spacing.md,

              backgroundColor: theme.card.default.background,

              borderWidth: 1,
              borderColor: theme.card.default.border,

              borderRadius: radius.md,
            }}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={theme.icon.default.icon}
              style={{
                marginTop: 2,
              }}
            />

            <View
              style={{
                flex: 1,
              }}
            >
              <AppText variant="bodySmallBold">
                Your account information is secure
              </AppText>

              <AppText
                variant="bodySmall"
                color="secondary"
                style={{
                  marginTop: spacing.xs,
                }}
              >
                Your BVN and settlement details are securely handled and used
                only to verify and process your payouts.
              </AppText>
            </View>
          </View>
        </ScrollView>

        {/* ==================================================================
            FOOTER
        ================================================================== */}

        {hasVerifiedBVN && (
          <View
            style={{
              paddingBottom: spacing.lg,
              paddingTop: spacing.sm,
            }}
          >
            <Button
              title={
                updateSettlementAccount.isPending
                  ? "Saving..."
                  : "Save Settlement Account"
              }
              variant="primary"
              size="large"
              disabled={
                !isSettlementFormValid || updateSettlementAccount.isPending
              }
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
