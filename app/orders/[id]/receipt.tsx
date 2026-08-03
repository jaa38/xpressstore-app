import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { WebView } from "react-native-webview";

import { AppText } from "@/components/ui/AppText";

import { ReceiptHeader } from "@/components/receipt/ReceiptHeader";
import { ReceiptActionButton } from "@/components/receipt/ReceiptActionButton";

import { spacing, theme } from "@/theme";

import { useOrders } from "@/hooks/products/useOrders";

import { generateReceipt } from "@/services/receipt/generateReceipt";
import { receiptFromOrder } from "@/services/receipt/receiptFromOrder";

import {
  downloadOrderReceipt,
  shareOrderReceipt,
} from "@/services/receipt/orderReceiptActions";

export default function OrderReceiptScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { data: orders = [] } = useOrders();

  const order = orders.find(
    (item) => item.id === id
  );

  const [receiptUri, setReceiptUri] =
    useState<string>();

  const [loading, setLoading] =
    useState(true);

  const [sharing, setSharing] =
    useState(false);

  const [downloading, setDownloading] =
    useState(false);

  useEffect(() => {
    async function loadReceipt() {
      if (!order) {
        return;
      }

      try {
        const receipt =
          receiptFromOrder(order);

        const generatedReceipt =
          await generateReceipt(receipt);

        setReceiptUri(generatedReceipt.uri);
      } catch (error) {
        Alert.alert(
          "Unable to Generate Receipt",
          error instanceof Error
            ? error.message
            : "Something went wrong."
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
          backgroundColor:
            theme.background.primary,
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
          The requested receipt could not be
          generated.
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

      {/* Header */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
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
            Receipt
          </AppText>

          <AppText
            variant="body"
            color="secondary"
          >
            Receipt Preview
          </AppText>
        </View>
      </View>

      {/* Receipt Header */}

      <ReceiptHeader order={order} />

      {/* PDF */}

      <View
        style={{
          flex: 1,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.lg,
          overflow: "hidden",
          borderRadius: 16,
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
            <ActivityIndicator
              size="large"
              color={theme.icon.branding.icon}
            />

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
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="warning-outline"
              size={48}
              color={theme.icon.warning.icon}
            />

            <AppText
              variant="bodyLargeBold"
              style={{
                marginTop: spacing.md,
              }}
            >
              Receipt unavailable
            </AppText>
          </View>
        )}
      </View>

      {/* Actions */}

      <View
        style={{
          flexDirection: "row",
          gap: spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.lg,
        }}
      >
        <ReceiptActionButton
          icon="print-outline"
          title="Print"
          onPress={() => {
            Alert.alert(
              "Coming Soon",
              "Printing will be added next."
            );
          }}
        />

        <ReceiptActionButton
          icon="download-outline"
          title="Download"
          loading={downloading}
          onPress={async () => {
            try {
              setDownloading(true);

              await downloadOrderReceipt(order);
            } catch (error) {
              Alert.alert(
                "Unable to Download",
                error instanceof Error
                  ? error.message
                  : "Something went wrong."
              );
            } finally {
              setDownloading(false);
            }
          }}
        />

        <ReceiptActionButton
          icon="share-social-outline"
          title="Share"
          loading={sharing}
          onPress={async () => {
            try {
              setSharing(true);

              await shareOrderReceipt(order);
            } catch (error) {
              Alert.alert(
                "Unable to Share",
                error instanceof Error
                  ? error.message
                  : "Something went wrong."
              );
            } finally {
              setSharing(false);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}