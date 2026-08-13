import { View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { AddPaymentLinkHeader } from "@/components/payment-links/AddPaymentLinkHeader";
import { AddPaymentLinkFooter } from "@/components/payment-links/AddPaymentLinkFooter";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { AppText } from "@/components/ui/AppText";

import { EditButton } from "@/components/product/EditButton";

import { usePaymentLink } from "@/hooks/paymentLinks/usePaymentLink";
import { useCreatePaymentLink } from "@/hooks/paymentLinks/useCreatePaymentLink";
import { useValidatePaymentLinkReference } from "@/hooks/paymentLinks/useValidatePaymentLinkReference";

import { ROUTES } from "@/navigation/routes";

import { spacing, theme } from "@/theme";

import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

function generateReference(name: string) {
  return (
    name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .substring(0, 12) + Date.now().toString().slice(-6)
  );
}

export default function ReviewScreen() {
  const { paymentLink, resetPaymentLink } = usePaymentLink();

  const createPaymentLinkMutation = useCreatePaymentLink();

  const validatePaymentLinkReferenceMutation =
    useValidatePaymentLinkReference();

  function editInformation() {
    router.replace(ROUTES.ADD_PAYMENT_LINK_INFORMATION);
  }

  function editSettings() {
    router.replace(ROUTES.ADD_PAYMENT_LINK_SETTINGS);
  }

  /**
   * ---------------------------------------------------------------------------
   * Create Payment Link
   * ---------------------------------------------------------------------------
   *
   * Before creating the payment page, the generated payment-page reference
   * is validated against the backend.
   *
   * Flow:
   *
   * 1. Generate a payment-page reference.
   * 2. Validate the reference.
   * 3. Stop if the reference is unavailable.
   * 4. Create the payment page if the reference is available.
   *
   * Only fields documented by the current Payment Pages API are sent to the
   * create endpoint.
   *
   * Current backend endpoints:
   *
   * GET  /PaymentPages/ValidatePaymentPageLinkRefernce/{reference}
   * POST /PaymentPages/Add
   *
   * Future UI-only fields such as:
   *
   * - expiryDate
   * - paymentType
   * - allowMultiplePayments
   * - collectCustomerName
   * - collectCustomerEmail
   *
   * remain in the payment-link draft and are displayed in the UI, but are
   * intentionally NOT included in the create request until the backend
   * contract supports them.
   */
  async function createPaymentLink() {
    if (
      createPaymentLinkMutation.isPending ||
      validatePaymentLinkReferenceMutation.isPending
    ) {
      return;
    }

    const paymentLinkReference = generateReference(paymentLink.linkName);

    /**
     * -------------------------------------------------------------------------
     * Validate reference
     * -------------------------------------------------------------------------
     */
    let validationResponse;

    try {
      validationResponse =
        await validatePaymentLinkReferenceMutation.mutateAsync(
          paymentLinkReference
        );
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Unable to Validate Payment Link",
        error instanceof Error
          ? error.message
          : "Unable to validate the payment link reference."
      );

      return;
    }

    if (!validationResponse.data?.isAvailable) {
      Alert.alert(
        "Payment Link Reference Unavailable",
        "The generated payment link reference is already in use. Please try again."
      );

      return;
    }

    /**
     * -------------------------------------------------------------------------
     * Create payment link
     * -------------------------------------------------------------------------
     */
    try {
      await createPaymentLinkMutation.mutateAsync({
        name: paymentLink.linkName,

        description: paymentLink.description,

        amount: Number(paymentLink.amount),

        currency: paymentLink.currency,

        pageType: paymentLink.pageType,

        paymentLinkReference,

        isFixedAmount: paymentLink.isFixedAmount,

        redirectUrl: paymentLink.redirectUrl || undefined,

        isPhoneNumberRequired: paymentLink.isPhoneNumberRequired,

        isTestMode: paymentLink.isTestMode,

        subAccountId: paymentLink.subAccountId,

        subAccountGroupId: paymentLink.subAccountGroupId,

        extraFields: paymentLink.extraFields || undefined,
      });

      resetPaymentLink();

      router.replace(ROUTES.PAYMENT_LINKS);
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Unable to Create Payment Link",
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  const isCreating =
    createPaymentLinkMutation.isPending ||
    validatePaymentLinkReferenceMutation.isPending;

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
    >
      <AddPaymentLinkHeader
        title="Create Payment Link"
        step={3}
        totalSteps={3}
        progress={100}
        label="Review"
      />

      <Divider />

      <View
        style={{
          flex: 1,
          backgroundColor: theme.background.primary,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: spacing["2xl"],
          }}
        >
          <Card>
            {/* -----------------------------------------------------------------
                Summary
            ----------------------------------------------------------------- */}

            <View
              style={{
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: theme.icon.branding.background,
                }}
              >
                <Ionicons
                  name="link-outline"
                  size={32}
                  color={theme.icon.branding.icon}
                />
              </View>

              <AppText
                variant="bodyLargeBold"
                style={{
                  textAlign: "center",
                }}
              >
                {paymentLink.linkName || "Untitled Payment Link"}
              </AppText>

              <AppText variant="h2" color="link">
                {formatCurrency(Number(paymentLink.amount || 0), {
                  currency: paymentLink.currency,
                })}
              </AppText>

              <AppText variant="body" color="secondary">
                Payment Link
              </AppText>
            </View>

            <Divider
              style={{
                marginVertical: spacing.lg,
              }}
            />

            {/* -----------------------------------------------------------------
                Settings
            ----------------------------------------------------------------- */}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <AppText variant="bodyLargeBold">Settings</AppText>

              <EditButton onPress={editSettings} />
            </View>

            <View
              style={{
                marginTop: spacing.md,
                gap: spacing.sm,
              }}
            >
              <ReviewRow
                label="Expiry Date"
                value={
                  paymentLink.expiryDate
                    ? formatDate(paymentLink.expiryDate)
                    : "-"
                }
              />

              <ReviewRow
                label="Page Type"
                value={
                  paymentLink.pageType === "single"
                    ? "Single Payment"
                    : "Donation"
                }
              />

              <ReviewRow
                label="Fixed Amount"
                value={paymentLink.isFixedAmount ? "Enabled" : "Disabled"}
              />

              <ReviewRow
                label="Collect Phone"
                value={
                  paymentLink.isPhoneNumberRequired ? "Enabled" : "Disabled"
                }
              />

              <ReviewRow
                label="Test Mode"
                value={paymentLink.isTestMode ? "Enabled" : "Disabled"}
              />

              <ReviewRow
                label="Redirect URL"
                value={paymentLink.redirectUrl || "-"}
              />

              {/* -----------------------------------------------------------------
                  Future backend fields
              ----------------------------------------------------------------- */}

              <ReviewRow
                label="Payment Type"
                value={
                  paymentLink.paymentType === "one-time"
                    ? "One-time Payment"
                    : "Subscription Payment"
                }
              />

              <ReviewRow
                label="Multiple Payments"
                value={
                  paymentLink.allowMultiplePayments ? "Enabled" : "Disabled"
                }
              />

              <ReviewRow
                label="Collect Customer Name"
                value={paymentLink.collectCustomerName ? "Enabled" : "Disabled"}
              />

              <ReviewRow
                label="Collect Customer Email"
                value={
                  paymentLink.collectCustomerEmail ? "Enabled" : "Disabled"
                }
              />
            </View>

            <Divider
              style={{
                marginVertical: spacing.lg,
              }}
            />

            {/* -----------------------------------------------------------------
                Payment Information
            ----------------------------------------------------------------- */}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <AppText variant="bodyLargeBold">Payment Information</AppText>

              <EditButton onPress={editInformation} />
            </View>

            <View
              style={{
                marginTop: spacing.md,
                gap: spacing.sm,
              }}
            >
              <ReviewRow label="Name" value={paymentLink.linkName || "-"} />

              <ReviewRow
                label="Amount"
                value={formatCurrency(Number(paymentLink.amount || 0), {
                  currency: paymentLink.currency,
                })}
              />

              <ReviewRow label="Currency" value={paymentLink.currency} />

              <ReviewRow
                label="Description"
                value={paymentLink.description || "-"}
              />
            </View>
          </Card>
        </ScrollView>

        <Divider />

        <AddPaymentLinkFooter
          primaryLabel={
            createPaymentLinkMutation.isPending ||
            validatePaymentLinkReferenceMutation.isPending
              ? "Creating..."
              : "Create Payment Link"
          }
          secondaryLabel="Back"
          onPrimary={createPaymentLink}
          onSecondary={() => router.back()}
        />
      </View>
    </SafeAreaView>
  );
}

/**
 * ---------------------------------------------------------------------------
 * Review Row
 * ---------------------------------------------------------------------------
 */

interface ReviewRowProps {
  label: string;
  value: string;
}

function ReviewRow({ label, value }: ReviewRowProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <AppText variant="body" color="secondary">
        {label}
      </AppText>

      <AppText
        variant="bodyBold"
        style={{
          flexShrink: 1,
          textAlign: "right",
          maxWidth: "60%",
        }}
      >
        {value}
      </AppText>
    </View>
  );
}
