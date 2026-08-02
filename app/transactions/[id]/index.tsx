import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { useTransactions } from "@/hooks/transactions/useTransactions";

import { TransactionSummarySection } from "@/components/transactions/TransactionSummarySection";

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { data: transactions = [] } = useTransactions();

  const transaction = transactions.find(
    (item) => item.id === id
  );

  if (!transaction) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background.primary,
        }}
      >
        <AppText>Transaction not found.</AppText>
      </SafeAreaView>
    );
  }

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
          <TransactionSummarySection
            transaction={transaction}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}