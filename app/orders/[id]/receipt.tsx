import { useCallback, useEffect, useState } from "react";

import { Alert, Pressable, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router, useLocalSearchParams } from "expo-router";

import { WebView } from "react-native-webview";

import { AppText } from "@/components/ui/AppText";

import { ReceiptActionButton } from "@/components/receipt/ReceiptActionButton";

import { ReceiptErrorState } from "@/components/receipt/ReceiptErrorState";

import { ReceiptHeader } from "@/components/receipt/ReceiptHeader";

import { ReceiptMetadataCard } from "@/components/receipt/ReceiptMetadataCard";

import { ReceiptSkeleton } from "@/components/receipt/ReceiptSkeleton";

import { ReceiptActionBar } from "@/components/receipt/ReceiptActionBar";

import { radius, spacing, theme } from "@/theme";

import { useOrders } from "@/hooks/orders/useOrders";

import { generateReceipt } from "@/services/receipt/generateReceipt";

import { receiptFromOrder } from "@/services/receipt/receiptFromOrder";

import {
  downloadOrderReceipt,
  printOrderReceipt,
  shareOrderReceipt,
} from "@/services/receipt/orderReceiptActions";

import { getMockOrderById, USE_MOCK_ORDERS } from "@/mocks";

export default function OrderReceiptScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  /**
   * -------------------------------------------------------------------------
   * API ORDERS
   * -------------------------------------------------------------------------
   */

  const { data } = useOrders();

  /**
   * -------------------------------------------------------------------------
   * ORDER
   * -------------------------------------------------------------------------
   *
   * Mock mode:
   *   Read from src/mocks/orders.ts
   *
   * API mode:
   *   Read from useOrders()
   * -------------------------------------------------------------------------
   */

  const order = USE_MOCK_ORDERS
    ? getMockOrderById(id)
    : data?.pages.flatMap((page) => page.orders).find((item) => item.id === id);

  /**
   * -------------------------------------------------------------------------
   * STATE
   * -------------------------------------------------------------------------
   */

  const [receiptUri, setReceiptUri] = useState<string | undefined>();

  const [loading, setLoading] = useState(true);

  const [hasError, setHasError] = useState(false);

  const [sharing, setSharing] = useState(false);

  const [downloading, setDownloading] = useState(false);

  const [printing, setPrinting] = useState(false);

  /**
   * -------------------------------------------------------------------------
   * LOAD RECEIPT
   * -------------------------------------------------------------------------
   */

  const loadReceipt = useCallback(async () => {
    if (!order) {
      setLoading(false);

      return;
    }

    setLoading(true);
    setHasError(false);

    try {
      const receipt = receiptFromOrder(order);

      const generatedReceipt = await generateReceipt(receipt);

      setReceiptUri(generatedReceipt.uri);
    } catch (error) {
      console.error(error);

      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, [order]);

  /**
   * -------------------------------------------------------------------------
   * LOAD
   * -------------------------------------------------------------------------
   */

  useEffect(() => {
    loadReceipt();
  }, [loadReceipt]);

  /**
   * -------------------------------------------------------------------------
   * ORDER NOT FOUND
   * -------------------------------------------------------------------------
   */

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
          align="center"
          color="secondary"
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

  /**
   * -------------------------------------------------------------------------
   * LOADING
   * -------------------------------------------------------------------------
   */

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.background.primary,
        }}
      >
        <StatusBar style="auto" />

        <ReceiptSkeleton />
      </SafeAreaView>
    );
  }

  /**
   * -------------------------------------------------------------------------
   * UI
   * -------------------------------------------------------------------------
   */

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
    >
      <StatusBar style="auto" />

      {/* HEADER */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: spacing.md,
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
          <Ionicons name="chevron-back" size={24} color={theme.text.primary} />
        </Pressable>

        <View
          style={{
            flex: 1,
          }}
        >
          <AppText variant="h1">Receipt</AppText>

          <AppText variant="body" color="secondary">
            Receipt Preview
          </AppText>
        </View>
      </View>

      {/* RECEIPT HEADER */}

      <ReceiptHeader order={order} />

      {/* RECEIPT METADATA */}

      <ReceiptMetadataCard order={order} />

      {/* RECEIPT PREVIEW */}

      <View
        style={{
          flex: 1,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.lg,
          borderRadius: radius.lg,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: theme.border.default,
          backgroundColor: theme.background.surface,
        }}
      >
        {hasError ? (
          <ReceiptErrorState onRetry={loadReceipt} />
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
          <ReceiptErrorState
            title="Receipt unavailable"
            message="No receipt could be generated for this order."
            onRetry={loadReceipt}
          />
        )}
      </View>

      {/* ACTIONS */}

      <ReceiptActionBar>
        {/* PRINT */}

        <ReceiptActionButton
          icon="print-outline"
          title="Print"
          loading={printing}
          onPress={async () => {
            try {
              setPrinting(true);

              await printOrderReceipt(order);
            } catch (error) {
              Alert.alert(
                "Unable to Print",
                error instanceof Error ? error.message : "Something went wrong."
              );
            } finally {
              setPrinting(false);
            }
          }}
        />

        {/* DOWNLOAD */}

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
                error instanceof Error ? error.message : "Something went wrong."
              );
            } finally {
              setDownloading(false);
            }
          }}
        />

        {/* SHARE */}

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
                error instanceof Error ? error.message : "Something went wrong."
              );
            } finally {
              setSharing(false);
            }
          }}
        />
      </ReceiptActionBar>
    </SafeAreaView>
  );
}
