import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { AddPaymentLinkHeader } from "@/components/payment-links/AddPaymentLinkHeader";
import { AddPaymentLinkFooter } from "@/components/payment-links/AddPaymentLinkFooter";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";

import { spacing, theme } from "@/theme";
import { AppText } from "@/components/ui/AppText";

import { ROUTES } from "@/navigation/routes";

import { usePaymentLink } from "@/hooks/usePaymentLink";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "@/utils/formatCurrency";
import { EditButton } from "@/components/product/EditButton";

import { formatDate } from "@/utils/formatDate";

import { nanoid } from "nanoid/non-secure";

function generateSlug(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function ReviewScreen() {
  const { paymentLink, addPaymentLink, resetPaymentLink } = usePaymentLink();

  function editInformation() {
    router.replace(ROUTES.ADD_PAYMENT_LINK_INFORMATION);
  }

  function editSettings() {
    router.replace(ROUTES.ADD_PAYMENT_LINK_SETTINGS);
  }

  function createPaymentLink() {
    const slug = generateSlug(paymentLink.linkName) || Date.now().toString();

    addPaymentLink({
      id: nanoid(),
      title: paymentLink.linkName,
      image: undefined,
      url: `payx.press/${slug}`,
      createdAt: "Just now",
      amount: Number(paymentLink.amount),
      currency: paymentLink.currency,
      status: "pending",
    });

    resetPaymentLink();

    router.replace(ROUTES.PAYMENT_LINKS);
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
      edges={["top"]}
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
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: spacing["2xl"],
          }}
          showsVerticalScrollIndicator={false}
        >
          <Card>
            {/* Summary */}

            <View
              style={{
                alignItems: "center",
                // paddingVertical: spacing.lg,
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
              <AppText
                variant="h2"
                color="link"
                style={{
                  textAlign: "center",
                }}
              >
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

            {/* Settings */}

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
                marginTop: spacing.rg,
                gap: spacing.sm,
              }}
            >
              {/* Expiry Date */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <AppText variant="body" color="secondary">
                  Expiry Date
                </AppText>

                <AppText
                  variant="bodyBold"
                  color="primary"
                  style={{
                    flexShrink: 1,
                    textAlign: "right",
                  }}
                >
                  {paymentLink.expiryDate
                    ? formatDate(paymentLink.expiryDate)
                    : "-"}
                </AppText>
              </View>

              {/* Payment Type */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <AppText variant="body" color="secondary">
                  Payment Type
                </AppText>

                <AppText variant="bodyBold" color="primary">
                  {paymentLink.paymentType === "one-time"
                    ? "One-time"
                    : "Subscription"}
                </AppText>
              </View>

              {/* Multiple Payments */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <AppText variant="body" color="secondary">
                  Multiple Payments
                </AppText>

                <AppText
                  variant="bodyBold"
                  color={
                    paymentLink.allowMultiplePayments ? "success" : "secondary"
                  }
                >
                  {paymentLink.allowMultiplePayments ? "Enabled" : "Disabled"}
                </AppText>
              </View>

              {/* Collect Customer Name */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <AppText variant="body" color="secondary">
                  Collect Customer Name
                </AppText>

                <AppText
                  variant="bodyBold"
                  color={
                    paymentLink.collectCustomerName ? "success" : "secondary"
                  }
                >
                  {paymentLink.collectCustomerName ? "Enabled" : "Disabled"}
                </AppText>
              </View>

              {/* Collect Customer Email */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <AppText variant="body" color="secondary">
                  Collect Customer Email
                </AppText>

                <AppText
                  variant="bodyBold"
                  color={
                    paymentLink.collectCustomerEmail ? "success" : "secondary"
                  }
                >
                  {paymentLink.collectCustomerEmail ? "Enabled" : "Disabled"}
                </AppText>
              </View>

              {/* Redirect URL */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <AppText variant="body" color="secondary">
                  Redirect URL
                </AppText>

                <AppText
                  variant="bodyBold"
                  color="primary"
                  style={{
                    flexShrink: 1,
                    textAlign: "right",
                    maxWidth: "60%",
                  }}
                >
                  {paymentLink.redirectUrl || "-"}
                </AppText>
              </View>
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
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <AppText variant="bodyLargeBold">Payment Information</AppText>

              <EditButton onPress={editInformation} />
            </View>

            <View
              style={{
                marginTop: spacing.rg,
                gap: spacing.sm,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <AppText variant="body" color="secondary">
                  Link Name
                </AppText>

                <AppText
                  variant="bodyBold"
                  color="primary"
                  style={{
                    flexShrink: 1,
                    textAlign: "right",
                  }}
                >
                  {paymentLink.linkName || "-"}
                </AppText>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <AppText variant="body" color="secondary">
                  Amount
                </AppText>

                <AppText variant="bodyBold" color="primary">
                  {formatCurrency(Number(paymentLink.amount || 0), {
                    currency: paymentLink.currency,
                  })}
                </AppText>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <AppText variant="body" color="secondary">
                  Currency
                </AppText>

                <AppText variant="bodyBold" color="primary">
                  {paymentLink.currency}
                </AppText>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <AppText variant="body" color="secondary">
                  Description
                </AppText>

                <AppText
                  variant="bodyBold"
                  color="primary"
                  style={{
                    flexShrink: 1,
                    textAlign: "right",
                    maxWidth: "60%",
                  }}
                >
                  {paymentLink.description || "-"}
                </AppText>
              </View>
            </View>
          </Card>
        </ScrollView>

        <Divider />

        <AddPaymentLinkFooter
          primaryLabel="Create Payment Link"
          secondaryLabel="Back"
          onPrimary={createPaymentLink}
          onSecondary={() => router.back()}
        />
      </View>
    </SafeAreaView>
  );
}
