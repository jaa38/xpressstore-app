import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme, radius } from "@/theme";

import { useOrders } from "@/hooks/products/useOrders";

import { generateReceipt } from "@/services/receipt/generateReceipt";
import { receiptFromOrder } from "@/services/receipt/receiptFromOrder";
import {
  downloadOrderReceipt,
  shareOrderReceipt,
} from "@/services/receipt/orderReceiptActions";

import { ReceiptActionButton } from "@/components/receipt/ReceiptActionButton";

export default function OrderReceiptScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { data: orders = [] } = useOrders();

  const order = orders.find((item) => item.id === id);

  const [receiptUri, setReceiptUri] = useState<string>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReceipt() {
      if (!order) {
        return;
      }

      try {
        const receipt = receiptFromOrder(order);

        const generatedReceipt = await generateReceipt(receipt);

        setReceiptUri(generatedReceipt.uri);
      } catch (error) {
        Alert.alert(
          "Unable to Generate Receipt",
          error instanceof Error ? error.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    loadReceipt();
  }, [order]);

  if (!order) {
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
          size={64}
          color={theme.icon.default.icon}
        />

        <AppText
          variant="h2"
          style={{
            marginTop: spacing.lg,
          }}
        >
          Receipt Not Found
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
          The requested receipt could not be generated.
        </AppText>
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

      {/* Header */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
          paddingHorizontal: spacing.lg,
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
          <Ionicons name="chevron-back" size={24} color={theme.text.primary} />
        </Pressable>

        <View
          style={{
            flex: 1,
          }}
        >
          <AppText variant="h1">Receipt</AppText>

          <AppText variant="body" color="secondary">
            Preview Receipt
          </AppText>
        </View>
      </View>

      {/* Preview */}

      <View
        style={{
          flex: 1,
          marginTop: spacing.md,
        }}
      >
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color={theme.icon.branding.icon} />

            <AppText
              color="secondary"
              style={{
                marginTop: spacing.md,
              }}
            >
              Generating receipt...
            </AppText>
          </View>
        ) : receiptUri ? (
          <WebView
            source={{
              uri: receiptUri,
            }}
            style={{
              flex: 1,
            }}
          />
        ) : null}
      </View>

      {/* Actions */}

      <View
        style={{
          flexDirection: "row",
          gap: spacing.md,
          padding: spacing.lg,
        }}
      >
        <ReceiptActionButton
          icon="print-outline"
          title="Print"
          onPress={() => {
            // Next phase
          }}
        />

        <ReceiptActionButton
          icon="download-outline"
          title="Download"
          onPress={() => downloadOrderReceipt(order)}
        />

        <ReceiptActionButton
          icon="share-social-outline"
          title="Share"
          onPress={() => shareOrderReceipt(order)}
        />
      </View>
    </SafeAreaView>
  );
}
