import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

import { useEffect, useRef, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { Controller, useForm } from "react-hook-form";

import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { AppText } from "@/components/ui/AppText";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";

import { spacing, theme, radius } from "@/theme";

import { useOnboardingStore } from "@/store/onboarding/onboardingStore";

import { useVerifyBVN } from "@/hooks/kyc/useVerifyBVN";

import { useValidateSettlementAccount } from "@/hooks/merchant/useValidateSettlementAccount";

import { useSettlementAccounts } from "@/hooks/merchant/useSettlementAccounts";

import { useUpdateSettlementAccount } from "@/hooks/merchant/useUpdateSettlementAccount";

import { useDeleteSettlementAccount } from "@/hooks/merchant/useDeleteSettlementAccount";

import { useSetPrimarySettlementAccount } from "@/hooks/merchant/useSetPrimarySettlementAccount";

import { getApiErrorMessage } from "@/api/errors";

import { ROUTES } from "@/navigation/routes";

import { SettlementAccount } from "@/types/merchant";

import { BANK_CONFIG, BANK_OPTIONS } from "@/constants/banks";

import { Card } from "@/components/ui/Card";

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

type SettlementMode = "view" | "add" | "change";

/**
 * ============================================================================
 * HELPERS
 * ============================================================================
 */

function maskAccountNumber(accountNumber: string) {
  if (!accountNumber) {
    return "Not available";
  }

  if (accountNumber.length <= 4) {
    return accountNumber;
  }

  return `••••••${accountNumber.slice(-4)}`;
}

function getBankCardConfig(bankName: string) {
  return (
    BANK_CONFIG[bankName] ?? {
      label: bankName,
      code: "",
      logo: undefined,
      background: theme.icon.branding.icon,
      logoBackground: "#FFFFFF",
    }
  );
}

/**
 * ============================================================================
 * SWIPE ACTIONS
 * ============================================================================
 */

function RightActions({
  onSetPrimary,
  onDelete,
  isPrimary,
  disabled,
}: {
  onSetPrimary: () => void;
  onDelete: () => void;
  isPrimary: boolean;
  disabled: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: spacing.sm,
      }}
    >
      {!isPrimary && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Set settlement account as primary"
          disabled={disabled}
          onPress={onSetPrimary}
          style={{
            width: 90,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.action.primary.background,
            borderRadius: radius.md,
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <Ionicons
            name="star-outline"
            size={24}
            color={theme.action.primary.text}
          />

          <AppText color="inverse">Set Primary</AppText>
        </Pressable>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Delete settlement account"
        disabled={disabled}
        onPress={onDelete}
        style={{
          width: 90,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.action.destructive.background,
          borderRadius: radius.md,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Ionicons
          name="trash-outline"
          size={24}
          color={theme.action.destructive.text}
        />

        <AppText color="inverse">Delete</AppText>
      </Pressable>
    </View>
  );
}

/**
 * ============================================================================
 * SETTLEMENT ACCOUNT CARD
 * ============================================================================
 */

type SettlementAccountCardProps = {
  account: SettlementAccount;

  isDeleting: boolean;

  isSettingPrimary: boolean;

  isUpdating: boolean;

  onChange: () => void;

  onDelete: () => void;

  onSetPrimary: () => void;
};

function SettlementAccountCard({
  account,
  isDeleting,
  isSettingPrimary,
  isUpdating,
  onChange,
  onDelete,
  onSetPrimary,
}: SettlementAccountCardProps) {
  const isBusy = isDeleting || isSettingPrimary || isUpdating;

  const cardConfig = getBankCardConfig(account.bankName);

  return (
    <Swipeable
      enabled={!isBusy}
      renderRightActions={() => (
        <RightActions
          isPrimary={account.isDefault}
          disabled={isBusy}
          onSetPrimary={onSetPrimary}
          onDelete={onDelete}
        />
      )}
    >
      <View
        style={{
          /**
           * Reduced from 220px to 180px.
           * This keeps the card visually similar to a bank card
           * while allowing more accounts to fit on screen.
           */
          height: 180,

          borderRadius: 24,

          backgroundColor: cardConfig.background,

          overflow: "hidden",

          position: "relative",

          justifyContent: "space-between",

          padding: spacing.md,

          opacity: isBusy ? 0.7 : 1,
        }}
      >
        {/* ================================================================ */}
        {/* DECORATIVE CARD SHAPE */}
        {/* ================================================================ */}

        <View
          pointerEvents="none"
          style={{
            position: "absolute",

            width: 200,

            height: 200,

            borderRadius: 100,

            right: -80,

            top: -100,

            backgroundColor: "rgba(255,255,255,0.08)",
          }}
        />

        <View
          pointerEvents="none"
          style={{
            position: "absolute",

            width: 150,

            height: 150,

            borderRadius: 75,

            left: -95,

            bottom: -110,

            backgroundColor: "rgba(255,255,255,0.06)",
          }}
        />

        {/* ================================================================ */}
        {/* CARD HEADER */}
        {/* ================================================================ */}

        <View
          style={{
            flexDirection: "row",

            alignItems: "center",

            justifyContent: "space-between",

            gap: spacing.sm,
          }}
        >
          <View
            style={{
              flexDirection: "row",

              alignItems: "center",

              gap: spacing.sm,

              flex: 1,
            }}
          >
            {/* BANK LOGO */}

            <View
              style={{
                width: 56,

                height: 56,

                borderRadius: 14,

                backgroundColor: cardConfig.logoBackground ?? "#FFFFFF",

                justifyContent: "center",

                alignItems: "center",

                overflow: "hidden",

                flexShrink: 0,
              }}
            >
              {cardConfig.logo ? (
                <Image
                  source={cardConfig.logo}
                  style={{
                    width: 46,

                    height: 46,
                  }}
                  resizeMode="contain"
                />
              ) : (
                <AppText
                  variant="bodyBold"
                  style={{
                    color: cardConfig.background,

                    textAlign: "center",

                    fontSize: 16,

                    lineHeight: 18,
                  }}
                >
                  {account.bankName}
                </AppText>
              )}
            </View>

            {/* BANK NAME */}

            <View
              style={{
                flex: 1,

                gap: 2,
              }}
            >
              <AppText
                variant="bodyLargeBold"
                color="inverse"
                numberOfLines={1}
              >
                {account.bankName}
              </AppText>

              <AppText
                variant="bodySmall"
                color="inverse"
                style={{
                  opacity: 0.75,
                }}
              >
                Settlement Account
              </AppText>
            </View>
          </View>

          {/* ============================================================ */}
          {/* PRIMARY BADGE */}
          {/* ============================================================ */}

          {account.isDefault && (
            <View
              style={{
                flexDirection: "row",

                alignItems: "center",

                gap: spacing.xs,

                backgroundColor: "#FFFFFF",

                paddingHorizontal: spacing.sm,

                paddingVertical: 6,

                borderRadius: radius.full,
              }}
            >
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={theme.icon.success.icon}
              />

              <AppText variant="bodySmallBold">Primary</AppText>
            </View>
          )}
        </View>

        {/* ================================================================ */}
        {/* CARD FOOTER */}
        {/* ================================================================ */}

        <View
          style={{
            flexDirection: "row",

            alignItems: "flex-end",

            justifyContent: "space-between",

            gap: spacing.md,
          }}
        >
          {/* ACCOUNT NAME */}

          <View
            style={{
              flex: 1,

              gap: 2,
            }}
          >
            <AppText
              variant="bodySmall"
              color="inverse"
              style={{
                opacity: 0.7,

                letterSpacing: 1.4,

                fontSize: 11,
              }}
            >
              ACCOUNT NAME
            </AppText>

            <AppText variant="bodyBold" color="inverse" numberOfLines={1}>
              {account.accountName}
            </AppText>
          </View>

          {/* XPRESSSTORE */}

          <View
            style={{
              alignItems: "flex-end",

              gap: 1,
            }}
          >
            <AppText
              variant="bodySmall"
              color="inverse"
              style={{
                opacity: 0.75,

                fontSize: 12,
              }}
            >
              XpressStore
            </AppText>

            <AppText
              variant="bodySmallBold"
              color="inverse"
              style={{
                letterSpacing: 1.4,

                fontSize: 12,
              }}
            >
              SETTLEMENT
            </AppText>
          </View>
        </View>
      </View>
    </Swipeable>
  );
}

/**
 * ============================================================================
 * SETTLEMENTS SCREEN
 * ============================================================================
 */

export default function SettlementsScreen() {
  const { bvn, setBVN, setVerifiedBVN } = useOnboardingStore();

  const verifyBVN = useVerifyBVN();

  const { mutateAsync: validateSettlementAccount } =
    useValidateSettlementAccount();

  const updateSettlementAccount = useUpdateSettlementAccount();

  const deleteSettlementAccount = useDeleteSettlementAccount();

  const setPrimarySettlementAccount = useSetPrimarySettlementAccount();

  const {
    settlementAccounts = [],

    isLoading: isSettlementAccountsLoading,

    isError: isSettlementAccountsError,

    refetch: refetchSettlementAccounts,
  } = useSettlementAccounts();

  /**
   * ==========================================================================
   * LOCAL STATE
   * ==========================================================================
   */

  const [mode, setMode] = useState<SettlementMode>("view");

  const [selectedAccount, setSelectedAccount] =
    useState<SettlementAccount | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [accountResolutionStatus, setAccountResolutionStatus] =
    useState<AccountResolutionStatus>("idle");

  const [accountResolutionMessage, setAccountResolutionMessage] = useState("");

  const [deletingAccountId, setDeletingAccountId] = useState<
    string | number | null
  >(null);

  const [settingPrimaryAccountId, setSettingPrimaryAccountId] = useState<
    string | number | null
  >(null);

  const resolveRequestRef = useRef(0);

  /**
   * ==========================================================================
   * FORM
   * ==========================================================================
   */

  const {
    control,

    handleSubmit,

    watch,

    setValue,

    reset,
  } = useForm<SettlementForm>({
    defaultValues: {
      bvn: bvn ?? "",

      bankCode: "",

      accountNumber: "",

      accountName: "",
    },
  });

  const {
    bvn: enteredBVN,

    bankCode,

    accountNumber,

    accountName,
  } = watch();

  /**
   * ==========================================================================
   * FORM STATE
   * ==========================================================================
   */

  const hasVerifiedBVN = Boolean(bvn);

  const isBVNValid = /^\d{11}$/.test(enteredBVN);

  const isAccountNumberValid = /^\d{10}$/.test(accountNumber);

  const isSettlementFormValid =
    hasVerifiedBVN &&
    Boolean(bankCode) &&
    isAccountNumberValid &&
    Boolean(accountName.trim()) &&
    accountResolutionStatus === "success";

  /**
   * ==========================================================================
   * SYNC VERIFIED BVN
   * ==========================================================================
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
   */

  useEffect(() => {
    if (mode === "view") {
      return;
    }

    resolveRequestRef.current += 1;

    const requestId = resolveRequestRef.current;

    const isValidAccountNumber = /^\d{10}$/.test(accountNumber);

    if (!bankCode || !isValidAccountNumber) {
      setValue("accountName", "");

      setAccountResolutionStatus("idle");

      setAccountResolutionMessage("");

      return;
    }

    const isExistingAccountUnchanged =
      mode === "change" &&
      selectedAccount &&
      selectedAccount.bankCode === bankCode &&
      selectedAccount.accountNumber === accountNumber;

    if (isExistingAccountUnchanged) {
      setValue("accountName", selectedAccount.accountName);

      setAccountResolutionStatus("success");

      setAccountResolutionMessage("");

      return;
    }

    setValue("accountName", "");

    setAccountResolutionStatus("resolving");

    setAccountResolutionMessage("");

    const timeout = setTimeout(async () => {
      try {
        const response = await validateSettlementAccount({
          bankCode,

          accountNumber,
        });

        if (requestId !== resolveRequestRef.current) {
          return;
        }

        const resolvedAccountName = response.data?.accountName?.trim();

        if (!resolvedAccountName) {
          setAccountResolutionStatus("error");

          setAccountResolutionMessage(
            response.responseMessage || "We could not verify this account."
          );

          return;
        }

        setValue("accountName", resolvedAccountName);

        setAccountResolutionStatus("success");

        setAccountResolutionMessage("");
      } catch (error) {
        if (requestId !== resolveRequestRef.current) {
          return;
        }

        setValue("accountName", "");

        setAccountResolutionStatus("error");

        setAccountResolutionMessage(getApiErrorMessage(error));
      }
    }, 600);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    mode,
    bankCode,
    accountNumber,
    selectedAccount,
    validateSettlementAccount,
    setValue,
  ]);

  /**
   * ==========================================================================
   * REFRESH
   * ==========================================================================
   */

  async function handleRefresh() {
    try {
      setIsRefreshing(true);

      await refetchSettlementAccounts();
    } finally {
      setIsRefreshing(false);
    }
  }

  /**
   * ==========================================================================
   * RESET FORM
   * ==========================================================================
   */

  function resetSettlementForm() {
    resolveRequestRef.current += 1;

    reset({
      bvn: bvn ?? "",

      bankCode: "",

      accountNumber: "",

      accountName: "",
    });

    setAccountResolutionStatus("idle");

    setAccountResolutionMessage("");

    setSelectedAccount(null);
  }

  /**
   * ==========================================================================
   * ADD ACCOUNT
   * ==========================================================================
   */

  function handleAddAccount() {
    resetSettlementForm();

    setMode("add");
  }

  /**
   * ==========================================================================
   * CHANGE ACCOUNT
   * ==========================================================================
   */

  function handleChangeAccount(account: SettlementAccount) {
    resolveRequestRef.current += 1;

    setSelectedAccount(account);

    reset({
      bvn: bvn ?? "",

      bankCode: account.bankCode,

      accountNumber: account.accountNumber,

      accountName: account.accountName,
    });

    setAccountResolutionStatus("success");

    setAccountResolutionMessage("");

    setMode("change");
  }

  /**
   * ==========================================================================
   * CANCEL FORM
   * ==========================================================================
   */

  function handleCancelForm() {
    resetSettlementForm();

    setMode("view");
  }

  /**
   * ==========================================================================
   * VERIFY BVN
   * ==========================================================================
   */

  async function onVerifyBVN() {
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

      setBVN(enteredBVN);

      setVerifiedBVN(response.data);

      setValue("bvn", enteredBVN);

      Alert.alert("BVN Verified", "Your BVN has been successfully verified.");
    } catch (error) {
      Alert.alert("Verification Failed", getApiErrorMessage(error));
    }
  }

  /**
   * ==========================================================================
   * SET PRIMARY ACCOUNT
   * ==========================================================================
   */

  function handleSetPrimaryAccount(account: SettlementAccount) {
    if (setPrimarySettlementAccount.isPending) {
      return;
    }

    Alert.alert(
      "Set Primary Account?",
      `${account.bankName} account ending in ${account.accountNumber.slice(
        -4
      )} will become your primary settlement account.`,
      [
        {
          text: "Cancel",

          style: "cancel",
        },

        {
          text: "Set Primary",

          onPress: async () => {
            setSettingPrimaryAccountId(account.settlementAccountId);

            try {
              await setPrimarySettlementAccount.mutateAsync(account);

              Alert.alert(
                "Primary Account Updated",
                "Your primary settlement account has been updated."
              );
            } catch (error) {
              Alert.alert(
                "Unable to Update Primary Account",
                getApiErrorMessage(error)
              );
            } finally {
              setSettingPrimaryAccountId(null);
            }
          },
        },
      ]
    );
  }

  /**
   * ==========================================================================
   * DELETE ACCOUNT
   * ==========================================================================
   */

  function handleDeleteSettlementAccount(account: SettlementAccount) {
    if (deleteSettlementAccount.isPending) {
      return;
    }

    Alert.alert(
      "Delete Settlement Account?",
      `Are you sure you want to remove your ${
        account.bankName
      } account ending in ${account.accountNumber.slice(-4)}?`,
      [
        {
          text: "Cancel",

          style: "cancel",
        },

        {
          text: "Delete",

          style: "destructive",

          onPress: async () => {
            setDeletingAccountId(account.settlementAccountId);

            try {
              await deleteSettlementAccount.mutateAsync(
                account.settlementAccountId
              );

              if (
                selectedAccount &&
                String(selectedAccount.settlementAccountId) ===
                  String(account.settlementAccountId)
              ) {
                resetSettlementForm();

                setMode("view");
              }

              Alert.alert(
                "Settlement Account Deleted",
                "Your settlement account has been successfully removed."
              );
            } catch (error) {
              Alert.alert(
                "Unable to Delete Account",
                getApiErrorMessage(error)
              );
            } finally {
              setDeletingAccountId(null);
            }
          },
        },
      ]
    );
  }

  /**
   * ==========================================================================
   * SAVE ACCOUNT
   * ==========================================================================
   */

  async function onSubmit(data: SettlementForm) {
    if (updateSettlementAccount.isPending) {
      return;
    }

    if (!hasVerifiedBVN) {
      Alert.alert(
        "BVN Verification Required",
        "Please verify your BVN before adding a settlement account."
      );

      return;
    }

    if (!data.bankCode) {
      Alert.alert("Bank Required", "Please select your bank.");

      return;
    }

    if (!/^\d{10}$/.test(data.accountNumber)) {
      Alert.alert(
        "Invalid Account Number",
        "Please enter a valid 10-digit account number."
      );

      return;
    }

    if (accountResolutionStatus !== "success" || !data.accountName.trim()) {
      Alert.alert(
        "Account Verification Required",
        "Please wait for your account to be successfully verified."
      );

      return;
    }

    const selectedBank = BANK_OPTIONS.find(
      (bank) => bank.value === data.bankCode
    );

    if (!selectedBank) {
      Alert.alert("Bank Required", "Please select a valid bank.");

      return;
    }

    const isChangingAccount = mode === "change";

    const shouldBePrimary = mode === "add" && settlementAccounts.length === 0;

    try {
      await updateSettlementAccount.mutateAsync({
        settlementAccountId: isChangingAccount
          ? selectedAccount?.settlementAccountId
          : undefined,

        accountNumber: data.accountNumber,

        accountName: data.accountName.trim(),

        bankName: selectedBank.label,

        bankCode: data.bankCode,

        isPrimary: isChangingAccount
          ? selectedAccount?.isDefault
          : shouldBePrimary,
      });

      resetSettlementForm();

      setMode("view");

      Alert.alert(
        isChangingAccount
          ? "Settlement Account Updated"
          : "Settlement Account Added",

        isChangingAccount
          ? "Your settlement account has been successfully updated."
          : "Your settlement account has been successfully added."
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
        {/* ================================================================ */}
        {/* HEADER */}
        {/* ================================================================ */}

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
              if (mode !== "view") {
                handleCancelForm();

                return;
              }

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
            <AppText variant="h1">Settlement Accounts</AppText>

            <AppText variant="bodySmall" color="secondary">
              Manage where your transaction settlements are paid.
            </AppText>
          </View>
        </View>

        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            paddingTop: spacing.lg,

            paddingBottom: spacing.xl,

            gap: spacing.lg,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ============================================================ */}
          {/* BVN STATUS */}
          {/* ============================================================ */}

          <View
            style={{
              padding: spacing.md,

              backgroundColor: theme.background.success,

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
                ? "Your verified BVN is linked to your settlement accounts."
                : "Verify your BVN before adding a settlement account."}
            </AppText>
          </View>

          {/* ============================================================ */}
          {/* ACCOUNT LIST */}
          {/* ============================================================ */}

          {mode === "view" && (
            <>
              <View
                style={{
                  flexDirection: "row",

                  alignItems: "center",

                  justifyContent: "space-between",

                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    flex: 1,

                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodyLargeBold">Your Accounts</AppText>

                  <AppText variant="bodySmall" color="secondary">
                    Select which account receives your settlements.
                  </AppText>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Add settlement account"
                  onPress={handleAddAccount}
                  style={{
                    flexDirection: "row",

                    alignItems: "center",

                    gap: spacing.xs,
                  }}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color={theme.icon.default.icon}
                  />

                  <AppText variant="bodySmallBold">Add</AppText>
                </Pressable>
              </View>

              {/* ======================================================== */}
              {/* LOADING */}
              {/* ======================================================== */}

              {isSettlementAccountsLoading && (
                <View
                  style={{
                    alignItems: "center",

                    paddingVertical: spacing.xl,

                    gap: spacing.sm,
                  }}
                >
                  <ActivityIndicator
                    size="small"
                    color={theme.icon.branding.icon}
                  />

                  <AppText variant="bodySmall" color="secondary">
                    Loading settlement accounts...
                  </AppText>
                </View>
              )}

              {/* ======================================================== */}
              {/* ERROR */}
              {/* ======================================================== */}

              {isSettlementAccountsError && (
                <View
                  style={{
                    gap: spacing.sm,

                    padding: spacing.md,

                    borderRadius: radius.md,

                    backgroundColor: theme.card.default.background,

                    borderWidth: 1,

                    borderColor: theme.card.default.border,
                  }}
                >
                  <AppText variant="bodyBold">
                    Unable to load settlement accounts
                  </AppText>

                  <AppText variant="bodySmall" color="secondary">
                    Pull down to try again.
                  </AppText>
                </View>
              )}

              {/* ======================================================== */}
              {/* EMPTY STATE */}
              {/* ======================================================== */}

              {!isSettlementAccountsLoading &&
                !isSettlementAccountsError &&
                settlementAccounts.length === 0 && (
                  <Card
                    style={{
                      alignItems: "center",
                      paddingVertical: spacing.xl,
                      paddingHorizontal: spacing.lg,
                    }}
                  >
                    <Image
                      source={require("../../../../assets/images/default-settlement-account.png")}
                      style={{
                        width: 220,
                        height: 180,
                      }}
                      resizeMode="contain"
                    />

                    <AppText
                      variant="bodyLargeBold"
                      style={{
                        marginTop: spacing.md,
                        textAlign: "center",
                      }}
                    >
                      No Settlement Account
                    </AppText>

                    <AppText
                      variant="body"
                      color="secondary"
                      style={{
                        marginTop: spacing.xs,
                        textAlign: "center",
                        maxWidth: 320,
                      }}
                    >
                      Add a bank account to receive your transaction
                      settlements.
                    </AppText>

                    <Button
                      title="Add Settlement Account"
                      variant="primary"
                      leftIcon={
                        <Ionicons
                          name="add"
                          size={20}
                          color={theme.action.primary.text}
                        />
                      }
                      style={{
                        marginTop: spacing.lg,
                      }}
                      onPress={handleAddAccount}
                    />

                    <AppText
                      variant="caption"
                      color="muted"
                      style={{
                        marginTop: spacing.sm,
                        textAlign: "center",
                      }}
                    >
                      Add your first settlement account to receive payments.
                    </AppText>
                  </Card>
                )}

              {/* ======================================================== */}
              {/* SETTLEMENT CARDS */}
              {/* ======================================================== */}

              {!isSettlementAccountsLoading &&
                !isSettlementAccountsError &&
                settlementAccounts.map((account) => {
                  const isDeletingThisAccount =
                    deleteSettlementAccount.isPending &&
                    String(deletingAccountId) ===
                      String(account.settlementAccountId);

                  const isSettingThisAccountPrimary =
                    setPrimarySettlementAccount.isPending &&
                    String(settingPrimaryAccountId) ===
                      String(account.settlementAccountId);

                  return (
                    <SettlementAccountCard
                      key={String(account.settlementAccountId)}
                      account={account}
                      isDeleting={isDeletingThisAccount}
                      isSettingPrimary={isSettingThisAccountPrimary}
                      isUpdating={false}
                      onChange={() => handleChangeAccount(account)}
                      onDelete={() => handleDeleteSettlementAccount(account)}
                      onSetPrimary={() => handleSetPrimaryAccount(account)}
                    />
                  );
                })}
            </>
          )}

          {/* ============================================================ */}
          {/* ADD / CHANGE FORM */}
          {/* ============================================================ */}

          {mode !== "view" && (
            <>
              <View
                style={{
                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodyLargeBold">
                  {mode === "add"
                    ? "Add Settlement Account"
                    : "Change Settlement Account"}
                </AppText>

                <AppText variant="bodySmall" color="secondary">
                  {mode === "add"
                    ? "Enter and verify the bank account you want to use for settlements."
                    : "Update the details of your settlement account."}
                </AppText>
              </View>

              {/* ======================================================== */}
              {/* BVN */}
              {/* ======================================================== */}

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
                          ? "Your BVN has already been verified."
                          : "Enter the BVN you want to use for settlements."
                      }
                    />
                  )}
                />

                {!hasVerifiedBVN && (
                  <Button
                    title={
                      verifyBVN.isPending ? "Verifying BVN..." : "Verify BVN"
                    }
                    variant="primary"
                    disabled={!isBVNValid || verifyBVN.isPending}
                    onPress={onVerifyBVN}
                  />
                )}
              </View>

              {/* ======================================================== */}
              {/* ACCOUNT DETAILS */}
              {/* ======================================================== */}

              {hasVerifiedBVN && (
                <View
                  style={{
                    gap: spacing.md,
                  }}
                >
                  <Controller
                    control={control}
                    name="bankCode"
                    render={({ field: { value, onChange } }) => (
                      <Dropdown
                        label="Bank"
                        placeholder="Select your bank"
                        value={value}
                        options={BANK_OPTIONS}
                        onSelect={onChange}
                      />
                    )}
                  />

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

                  {accountResolutionStatus === "resolving" && (
                    <View
                      style={{
                        flexDirection: "row",

                        alignItems: "center",

                        gap: spacing.sm,

                        padding: spacing.md,

                        borderRadius: radius.md,

                        backgroundColor: theme.card.default.background,

                        borderWidth: 1,

                        borderColor: theme.card.default.border,
                      }}
                    >
                      <ActivityIndicator
                        size="small"
                        color={theme.icon.branding.icon}
                      />

                      <AppText variant="bodySmall">
                        Verifying account...
                      </AppText>
                    </View>
                  )}

                  {accountResolutionStatus === "success" && accountName && (
                    <View
                      style={{
                        flexDirection: "row",

                        alignItems: "center",

                        gap: spacing.sm,

                        padding: spacing.md,

                        borderRadius: radius.md,

                        backgroundColor: theme.background.brand,
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

                  {accountResolutionStatus === "error" && (
                    <View
                      style={{
                        gap: spacing.xs,

                        padding: spacing.md,

                        borderRadius: radius.md,

                        backgroundColor: theme.card.default.background,

                        borderWidth: 1,

                        borderColor: theme.card.default.border,
                      }}
                    >
                      <AppText variant="bodySmallBold">
                        Unable to verify account
                      </AppText>

                      <AppText variant="bodySmall" color="secondary">
                        {accountResolutionMessage ||
                          "Check the bank and account number, then try again."}
                      </AppText>
                    </View>
                  )}
                </View>
              )}

              {/* ======================================================== */}
              {/* SECURITY */}
              {/* ======================================================== */}

              <View
                style={{
                  flexDirection: "row",

                  alignItems: "flex-start",

                  gap: spacing.sm,

                  padding: spacing.md,

                  borderRadius: radius.md,

                  backgroundColor: theme.card.default.background,

                  borderWidth: 1,

                  borderColor: theme.card.default.border,
                }}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.icon.default.icon}
                />

                <View
                  style={{
                    flex: 1,

                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmallBold">
                    Your account information is secure
                  </AppText>

                  <AppText variant="bodySmall" color="secondary">
                    Your BVN and settlement details are securely handled and
                    used only to verify and process your payouts.
                  </AppText>
                </View>
              </View>

              {/* ======================================================== */}
              {/* ACTIONS */}
              {/* ======================================================== */}

              {hasVerifiedBVN && (
                <View
                  style={{
                    gap: spacing.sm,
                  }}
                >
                  <Button
                    title={
                      updateSettlementAccount.isPending
                        ? "Saving..."
                        : mode === "change"
                          ? "Save Changes"
                          : "Save Settlement Account"
                    }
                    variant="primary"
                    size="large"
                    disabled={
                      !isSettlementFormValid ||
                      updateSettlementAccount.isPending
                    }
                    onPress={handleSubmit(onSubmit)}
                  />

                  <Button
                    title="Cancel"
                    variant="secondary"
                    size="large"
                    disabled={updateSettlementAccount.isPending}
                    onPress={handleCancelForm}
                  />
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
