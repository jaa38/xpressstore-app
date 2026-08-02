import { Alert, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { useTransactions } from "@/hooks/transactions/useTransactions";

import { TransactionSummarySection } from "@/components/transactions/TransactionSummarySection";
import { CustomerInformationSection } from "@/components/transactions/CustomerInformationSection";
import { TransactionInformationSection } from "@/components/transactions/TransactionInformationSection";
import { TransactionTimelineSection } from "@/components/transactions/TransactionTimelineSection";
import { TransactionReceiptActions } from "@/components/transactions/TransactionReceiptActions";

import { shareReceipt } from "@/services/receipt/receiptActions";
import { downloadReceipt } from "@/services/receipt/receiptActions";

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { data: transactions = [] } =
    useTransactions();

  const transaction = transactions.find(
    (item) => item.id === id
  );

  async function handleShareReceipt() {
    if (!transaction) return;

    try {
      await shareReceipt(transaction);
    } catch (error) {
      Alert.alert(
        "Unable to Share Receipt",
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    }
  }

  async function handleDownloadReceipt() {
    if (!transaction) return;

    try {
      const path =
        await downloadReceipt(transaction);

      Alert.alert(
        "Receipt Saved",
        `Receipt successfully generated.\n\n${path}`
      );
    } catch (error) {
      Alert.alert(
        "Unable to Download Receipt",
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    }
  }

  if (!transaction) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:
            theme.background.primary,
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
          The requested transaction could not be
          found.
        </AppText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          theme.background.primary,
      }}
    >
      <StatusBar style="auto" />

      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.lg,
        }}
      >
        {/* Header */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          <Pressable
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
            <AppText variant="h1">
              Transaction
            </AppText>

            <AppText
              variant="body"
              color="secondary"
            >
              Receipt Details
            </AppText>
          </View>
        </View>

        <ScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: spacing["3xl"],
          }}
        >
          {/* Summary */}

          <TransactionSummarySection
            transaction={transaction}
          />

          {/* Customer */}

          <CustomerInformationSection
            transaction={transaction}
          />

          {/* Transaction */}

          <TransactionInformationSection
            transaction={transaction}
          />

          {/* Timeline */}

          <TransactionTimelineSection
            transaction={transaction}
          />

          {/* Actions */}

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