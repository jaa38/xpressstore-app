import { FlatList, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { Transaction } from "@/types/transaction";

import { TransactionListItem } from "@/components/transactions/TransactionListItem";



type Props = {
  transactions: Transaction[];
};

export function TransactionList({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <Card
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: spacing["3xl"],
          paddingHorizontal: spacing.xl,
        }}
      >
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 999,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.icon.default.background,
          }}
        >
          <Ionicons
            name="receipt-outline"
            size={36}
            color={theme.icon.default.icon}
          />
        </View>

        <AppText
          variant="h3"
          style={{
            marginTop: spacing.lg,
            textAlign: "center",
          }}
        >
          No Transactions Yet
        </AppText>

        <AppText
          variant="body"
          color="secondary"
          style={{
            marginTop: spacing.sm,
            textAlign: "center",
          }}
        >
          Your completed and pending transactions will appear here once payments
          start coming in.
        </AppText>
      </Card>
    );
  }

  return (
    <Card
      style={{
        paddingHorizontal: 0,
        paddingVertical: 0,
        overflow: "hidden",
      }}
    >
      <FlatList
        data={transactions}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => <TransactionListItem transaction={item} />}
      />
    </Card>
  );
}
