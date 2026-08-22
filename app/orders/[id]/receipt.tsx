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

import { useOrder } from "@/hooks/orders/useOrder";

import { generateReceipt } from "@/services/receipt/generateReceipt";
import { receiptFromOrder } from "@/services/receipt/receiptFromOrder";

import {
  downloadOrderReceipt,
  printOrderReceipt,
  shareOrderReceipt,
} from "@/services/receipt/orderReceiptActions";

/**
 * ============================================================================
 * ORDER RECEIPT SCREEN
 * ============================================================================
 *
 * Order source:
 *
 *   useOrder(id)
 *       │
 *       ├── USE_MOCK_ORDERS = true
 *       │      └── getMockOrderById(id)
 *       │
 *       └── USE_MOCK_ORDERS = false
 *              └── getOrderById(id)
 *                     ├── GraphQL API
 *                     └── SQLite fallback
 *
 * This keeps the receipt screen independent of:
 *
 * - mock data implementation
 * - pagination
 * - useOrders()
 * - API/SQLite implementation details
 *
 * The receipt only needs an Order.
 * ============================================================================
 */

export default function OrderReceiptScreen() {
  /**
   * -------------------------------------------------------------------------
   * ROUTE PARAM
   * -------------------------------------------------------------------------
   */

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  /**
   * -------------------------------------------------------------------------
   * ORDER
   * -------------------------------------------------------------------------
   *
   * useOrder() is the single source of truth for retrieving an individual
   * order.
   *
   * Mock mode remains controlled by USE_MOCK_ORDERS inside the hook.
   */

  const {
    data: order,
    isLoading: isOrderLoading,
    isError: isOrderError,
    error: orderError,
  } = useOrder(id);

  /**
   * -------------------------------------------------------------------------
   * RECEIPT STATE
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
   *
   * Once the order has been retrieved, convert it into the receipt model
   * and generate the receipt document.
   * -------------------------------------------------------------------------
   */

  const loadReceipt = useCallback(async () => {
    /**
     * The order is still being loaded by React Query.
     *
     * Do not attempt receipt generation yet.
     */
    if (isOrderLoading) {
      return;
    }

    /**
     * No order was found.
     *
     * The screen itself will render the "Receipt Not Found" state.
     */
    if (!order) {
      setLoading(false);

      return;
    }

    setLoading(true);

    setHasError(false);

    try {
      /**
       * Convert the application Order model into
       * the receipt-specific model.
       */
      const receipt = receiptFromOrder(order);

      /**
       * Generate the receipt document.
       */
      const generatedReceipt = await generateReceipt(receipt);

      setReceiptUri(generatedReceipt.uri);
    } catch (error) {
      console.error("Failed to generate receipt.", error);

      setHasError(true);

      setReceiptUri(undefined);
    } finally {
      setLoading(false);
    }
  }, [isOrderLoading, order]);

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
   * ORDER LOADING
   * -------------------------------------------------------------------------
   *
   * This is separate from receipt generation loading.
   *
   * First:
   *
   *   Load order
   *
   * Then:
   *
   *   Generate receipt
   * -------------------------------------------------------------------------
   */

  if (isOrderLoading) {
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
   * ORDER ERROR / NOT FOUND
   * -------------------------------------------------------------------------
   */

  if (isOrderError || !order) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background.primary,
          paddingHorizontal: spacing.xl,
        }}
      >
        <StatusBar style="auto" />

        <Ionicons
          name="receipt-outline"
          size={64}
          color={theme.icon.default.icon}
        />

        <AppText
          variant="h2"
          style={{
            marginTop: spacing.lg,
            textAlign: "center",
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
          }}
        >
          {orderError instanceof Error
            ? orderError.message
            : "The requested receipt could not be generated."}
        </AppText>
      </SafeAreaView>
    );
  }

  /**
   * -------------------------------------------------------------------------
   * RECEIPT LOADING
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

      {/* ===================================================================
          HEADER
      =================================================================== */}

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

      {/* ===================================================================
          RECEIPT HEADER
      =================================================================== */}

      <ReceiptHeader order={order} />

      {/* ===================================================================
          RECEIPT METADATA
      =================================================================== */}

      <ReceiptMetadataCard order={order} />

      {/* ===================================================================
          RECEIPT PREVIEW
      =================================================================== */}

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

      {/* ===================================================================
          RECEIPT ACTIONS
      =================================================================== */}

      <ReceiptActionBar>
        {/* -----------------------------------------------------------------
            PRINT
        ----------------------------------------------------------------- */}

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

        {/* -----------------------------------------------------------------
            DOWNLOAD
        ----------------------------------------------------------------- */}

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

        {/* -----------------------------------------------------------------
            SHARE
        ----------------------------------------------------------------- */}

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
