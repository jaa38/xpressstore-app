import { Alert, Pressable, ScrollView, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router, useLocalSearchParams } from "expo-router";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { useTransaction } from "@/hooks/transactions/useTransaction";

import { TransactionSummarySection } from "@/components/transactions/TransactionSummarySection";
import { CustomerInformationSection } from "@/components/transactions/CustomerInformationSection";
import { TransactionInformationSection } from "@/components/transactions/TransactionInformationSection";
import { TransactionTimelineSection } from "@/components/transactions/TransactionTimelineSection";
import { TransactionReceiptActions } from "@/components/transactions/TransactionReceiptActions";

import {
  shareReceipt,
  downloadReceipt,
} from "@/services/receipt/receiptActions";

import { MOCK_TRANSACTIONS } from "@/mocks/transactions";

/**
 * ============================================================================
 * MOCK MODE
 * ============================================================================
 *
 * true:
 *   Detail screen uses shared local mock data.
 *
 * false:
 *   Detail screen uses the real useTransaction() API.
 *
 * The API hook itself is not modified.
 */
const USE_MOCK_TRANSACTIONS = true;

/**
 * ============================================================================
 * SCREEN
 * ============================================================================
 */

export default function TransactionDetailsScreen() {
  /**
   * --------------------------------------------------------------------------
   * ROUTE PARAMETER
   * --------------------------------------------------------------------------
   */

  const params = useLocalSearchParams<{
    id?: string | string[];
  }>();

  /**
   * Expo Router can return a route
   * parameter as either a string or
   * string[].
   *
   * Normalize it to a single string.
   */
  const transactionId = Array.isArray(params.id) ? params.id[0] : params.id;

  /**
   * --------------------------------------------------------------------------
   * REAL TRANSACTION API
   * --------------------------------------------------------------------------
   *
   * Keep the API hook untouched.
   *
   * When USE_MOCK_TRANSACTIONS is true,
   * the API result is ignored.
   */
  const {
    data: apiTransaction,
    isLoading: apiIsLoading,
    isError: apiIsError,
    error: apiError,
  } = useTransaction(transactionId ?? "");

  /**
   * --------------------------------------------------------------------------
   * MOCK TRANSACTION
   * --------------------------------------------------------------------------
   *
   * Look up the transaction using the
   * exact ID passed by TransactionList.
   */
  const mockTransaction = MOCK_TRANSACTIONS.find(
    (transaction) => transaction.id === transactionId
  );

  /**
   * --------------------------------------------------------------------------
   * ACTIVE TRANSACTION
   * --------------------------------------------------------------------------
   */

  const transaction = USE_MOCK_TRANSACTIONS ? mockTransaction : apiTransaction;

  const isLoading = USE_MOCK_TRANSACTIONS ? false : apiIsLoading;

  const isError = USE_MOCK_TRANSACTIONS ? false : apiIsError;

  const error = USE_MOCK_TRANSACTIONS ? null : apiError;

  /**
   * --------------------------------------------------------------------------
   * SHARE RECEIPT
   * --------------------------------------------------------------------------
   */

  async function handleShareReceipt() {
    if (!transaction) {
      return;
    }

    try {
      await shareReceipt(transaction);
    } catch (error) {
      Alert.alert(
        "Unable to Share Receipt",

        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  /**
   * --------------------------------------------------------------------------
   * DOWNLOAD RECEIPT
   * --------------------------------------------------------------------------
   */

  async function handleDownloadReceipt() {
    if (!transaction) {
      return;
    }

    try {
      const path = await downloadReceipt(transaction);

      Alert.alert(
        "Receipt Saved",
        `Receipt successfully generated.\n\n${path}`
      );
    } catch (error) {
      Alert.alert(
        "Unable to Download Receipt",

        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  /**
   * --------------------------------------------------------------------------
   * LOADING
   * --------------------------------------------------------------------------
   */

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background.primary,
        }}
      >
        <Ionicons
          name="receipt-outline"
          size={48}
          color={theme.icon.branding.icon}
        />

        <AppText
          variant="body"
          color="secondary"
          style={{
            marginTop: spacing.md,
          }}
        >
          Loading transaction...
        </AppText>
      </SafeAreaView>
    );
  }

  /**
   * --------------------------------------------------------------------------
   * NOT FOUND / ERROR
   * --------------------------------------------------------------------------
   */

  if (isError || !transaction) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background.primary,
        }}
      >
        <Ionicons
          name="receipt-outline"
          size={60}
          color={theme.icon.default.icon}
        />

        <AppText
          variant="h2"
          style={{
            marginTop: spacing.lg,
          }}
        >
          Transaction Not Found
        </AppText>

        <AppText
          variant="body"
          color="secondary"
          align="center"
          style={{
            marginTop: spacing.sm,
            paddingHorizontal: spacing.xl,
          }}
        >
          {error instanceof Error
            ? error.message
            : "The requested transaction could not be found."}
        </AppText>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={{
            marginTop: spacing.lg,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm,
          }}
        >
          <AppText color="link">Go Back</AppText>
        </Pressable>
      </SafeAreaView>
    );
  }

  /**
   * --------------------------------------------------------------------------
   * UI
   * --------------------------------------------------------------------------
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

          <View
            style={{
              flex: 1,
            }}
          >
            <AppText variant="h1">Transaction</AppText>

            <AppText variant="body" color="secondary">
              Receipt Details
            </AppText>
          </View>
        </View>

        {/* ================================================================
            TRANSACTION CONTENT
        ================================================================ */}

        <ScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: spacing["3xl"],
          }}
        >
          {/* SUMMARY */}

          <TransactionSummarySection transaction={transaction} />

          {/* CUSTOMER */}

          <CustomerInformationSection transaction={transaction} />

          {/* TRANSACTION INFORMATION */}

          <TransactionInformationSection transaction={transaction} />

          {/* TIMELINE */}

          <TransactionTimelineSection transaction={transaction} />

          {/* RECEIPT ACTIONS */}

          <TransactionReceiptActions
            transaction={transaction}
            onShare={handleShareReceipt}
            onDownload={handleDownloadReceipt}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
