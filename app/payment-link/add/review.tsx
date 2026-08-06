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
      .substring(0, 12) +
    Date.now().toString().slice(-6)
  );
}

export default function ReviewScreen() {
  const { paymentLink, resetPaymentLink } =
    usePaymentLink();

  const createPaymentLinkMutation =
    useCreatePaymentLink();

  function editInformation() {
    router.replace(
      ROUTES.ADD_PAYMENT_LINK_INFORMATION
    );
  }

  function editSettings() {
    router.replace(
      ROUTES.ADD_PAYMENT_LINK_SETTINGS
    );
  }

  function createPaymentLink() {
    createPaymentLinkMutation.mutate(
      {
        name: paymentLink.linkName,

        description:
          paymentLink.description || undefined,

        amount: Number(paymentLink.amount),

        currency: paymentLink.currency,

        pageType: paymentLink.pageType,

        paymentLinkReference:
          generateReference(
            paymentLink.linkName
          ),

        isFixedAmount:
          paymentLink.isFixedAmount,

        redirectUrl:
          paymentLink.redirectUrl || undefined,

        isPhoneNumberRequired:
          paymentLink.isPhoneNumberRequired,

        isTestMode: paymentLink.isTestMode,

        subAccountId:
          paymentLink.subAccountId,

        subAccountGroupId:
          paymentLink.subAccountGroupId,

        extraFields:
          paymentLink.extraFields || undefined,
      },
      {
        onSuccess() {
          resetPaymentLink();

          router.replace(
            ROUTES.PAYMENT_LINKS
          );
        },

        onError(error) {
          console.error(error);

          Alert.alert(
            "Unable to Create Payment Link",
            error instanceof Error
              ? error.message
              : "Something went wrong."
          );
        },
      }
    );
  }

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor:
          theme.background.primary,
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
          backgroundColor:
            theme.background.primary,
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
            {/* Summary */}

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
                  backgroundColor:
                    theme.icon.branding.background,
                }}
              >
                <Ionicons
                  name="link-outline"
                  size={32}
                  color={
                    theme.icon.branding.icon
                  }
                />
              </View>

              <AppText
                variant="bodyLargeBold"
                style={{
                  textAlign: "center",
                }}
              >
                {paymentLink.linkName ||
                  "Untitled Payment Link"}
              </AppText>

              <AppText
                variant="h2"
                color="link"
              >
                {formatCurrency(
                  Number(
                    paymentLink.amount || 0
                  ),
                  {
                    currency:
                      paymentLink.currency,
                  }
                )}
              </AppText>

              <AppText
                variant="body"
                color="secondary"
              >
                Payment Link
              </AppText>
            </View>

            <Divider
              style={{
                marginVertical: spacing.lg,
              }}
            />

            {/* Settings */}

            <View
              style={{
                flexDirection: "row",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <AppText variant="bodyLargeBold">
                Settings
              </AppText>

              <EditButton
                onPress={editSettings}
              />
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
                    ? formatDate(
                        paymentLink.expiryDate
                      )
                    : "-"
                }
              />

              <ReviewRow
                label="Page Type"
                value={
                  paymentLink.pageType ===
                  "single"
                    ? "Single Payment"
                    : "Multiple Payment"
                }
              />

              <ReviewRow
                label="Fixed Amount"
                value={
                  paymentLink.isFixedAmount
                    ? "Enabled"
                    : "Disabled"
                }
              />

              <ReviewRow
                label="Collect Phone"
                value={
                  paymentLink.isPhoneNumberRequired
                    ? "Enabled"
                    : "Disabled"
                }
              />

              <ReviewRow
                label="Test Mode"
                value={
                  paymentLink.isTestMode
                    ? "Enabled"
                    : "Disabled"
                }
              />

              <ReviewRow
                label="Redirect URL"
                value={
                  paymentLink.redirectUrl ||
                  "-"
                }
              />
            </View>

            <Divider
              style={{
                marginVertical: spacing.lg,
              }}
            />

            {/* Payment Information */}

            <View
              style={{
                flexDirection: "row",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <AppText variant="bodyLargeBold">
                Payment Information
              </AppText>

              <EditButton
                onPress={editInformation}
              />
            </View>

            <View
              style={{
                marginTop: spacing.md,
                gap: spacing.sm,
              }}
            >
              <ReviewRow
                label="Name"
                value={
                  paymentLink.linkName || "-"
                }
              />

              <ReviewRow
                label="Amount"
                value={formatCurrency(
                  Number(
                    paymentLink.amount || 0
                  ),
                  {
                    currency:
                      paymentLink.currency,
                  }
                )}
              />

              <ReviewRow
                label="Currency"
                value={paymentLink.currency}
              />

              <ReviewRow
                label="Description"
                value={
                  paymentLink.description ||
                  "-"
                }
              />
            </View>
          </Card>
        </ScrollView>

        <Divider />

        <AddPaymentLinkFooter
          primaryLabel={
            createPaymentLinkMutation.isPending
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

interface ReviewRowProps {
  label: string;
  value: string;
}

function ReviewRow({
  label,
  value,
}: ReviewRowProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent:
          "space-between",
      }}
    >
      <AppText
        variant="body"
        color="secondary"
      >
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