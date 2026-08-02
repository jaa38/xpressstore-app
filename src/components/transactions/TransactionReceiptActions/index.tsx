import { Alert, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";

import { spacing } from "@/theme";

import { Transaction } from "@/types/transaction";

interface Props {
  transaction: Transaction;
  onShare: () => void;
  onDownload: () => void;
}

export function TransactionReceiptActions({
  transaction,
  onShare,
  onDownload,
}: Props) {
  return (
    <Card
      style={{
        marginTop: spacing.lg,
      }}
    >
      <AppText variant="h3">
        Receipt Actions
      </AppText>

      <View
        style={{
          marginTop: spacing.lg,
          gap: spacing.md,
        }}
      >
        <Button
          title="Share Receipt"
          variant="primary"
          leftIcon={
            <Ionicons
              name="share-social-outline"
              size={20}
              color="white"
            />
          }
          onPress={onShare}
        />

        <Button
          title="Download Receipt"
          variant="secondary"
          leftIcon={
            <Ionicons
              name="download-outline"
              size={20}
              color="white"
            />
          }
          onPress={onDownload}
        />

        <Button
          title="Refund"
          variant="tertiaryDestructive"
          disabled
          leftIcon={
            <Ionicons
              name="return-up-back-outline"
              size={20}
              color="#DC2626"
            />
          }
          onPress={() => {
            Alert.alert(
              "Coming Soon",
              "Refunds will be available once backend support has been integrated."
            );
          }}
        />
      </View>
    </Card>
  );
}