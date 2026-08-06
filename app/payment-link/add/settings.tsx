import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { AddPaymentLinkHeader } from "@/components/payment-links/AddPaymentLinkHeader";
import { AddPaymentLinkFooter } from "@/components/payment-links/AddPaymentLinkFooter";

import { AppText } from "@/components/ui/AppText";
import { DatePicker } from "@/components/ui/DatePicker";
import { Divider } from "@/components/ui/Divider";
import { Input } from "@/components/ui/Input";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Switch } from "@/components/ui/Switch";

import { ROUTES } from "@/navigation/routes";

import {
  PaymentLinkSettingsForm,
  paymentLinkSettingsSchema,
} from "@/schemas/paymentLinkSettingsSchema";

import { usePaymentLink } from "@/hooks/paymentLinks/usePaymentLink";

import { spacing, theme } from "@/theme";

import type { PaymentLinkType } from "@/types/paymentLink";

const pageTypeOptions: {
  label: string;
  value: PaymentLinkType;
}[] = [
  {
    label: "Single Payment",
    value: "single",
  },
  {
    label: "Multiple Payments",
    value: "multiple",
  },
];

export default function PaymentLinkSettingsScreen() {
  const { paymentLink, updatePaymentLink } = usePaymentLink();

  const {
    control,
    handleSubmit,
    getValues,
  } = useForm<PaymentLinkSettingsForm>({
    resolver: zodResolver(paymentLinkSettingsSchema),

    defaultValues: {
      expiryDate: paymentLink.expiryDate,

      pageType: paymentLink.pageType,

      isFixedAmount: paymentLink.isFixedAmount,

      allowMultiplePayments:
        paymentLink.allowMultiplePayments,

      collectCustomerName:
        paymentLink.collectCustomerName,

      collectCustomerEmail:
        paymentLink.collectCustomerEmail,

      isPhoneNumberRequired:
        paymentLink.isPhoneNumberRequired,

      isTestMode: paymentLink.isTestMode,

      redirectUrl: paymentLink.redirectUrl,

      subAccountId: paymentLink.subAccountId,

      subAccountGroupId:
        paymentLink.subAccountGroupId,

      extraFields: paymentLink.extraFields,
    },
  });

  function onSubmit(data: PaymentLinkSettingsForm) {
    updatePaymentLink(data);

    router.push(ROUTES.ADD_PAYMENT_LINK_REVIEW);
  }

  function handleBack() {
    updatePaymentLink(getValues());

    router.back();
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
        step={2}
        totalSteps={3}
        progress={67}
        label="Settings"
      />

      <Divider />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: spacing.lg,
            gap: spacing.xl,
          }}
        >
          <AppText
            variant="body"
            color="secondary"
            style={{
              lineHeight: 22,
            }}
          >
            Configure how customers can use this payment
            link.
          </AppText>

          <Controller
            control={control}
            name="expiryDate"
            render={({ field, fieldState }) => (
              <DatePicker
                label="Expiry Date"
                value={field.value ?? undefined}
                minimumDate={new Date()}
                error={fieldState.error?.message}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="pageType"
            render={({ field }) => (
              <View
                style={{
                  gap: spacing.sm,
                }}
              >
                <AppText
                  variant="caption"
                  color="secondary"
                >
                  Payment Page Type
                </AppText>

                <RadioGroup
                  value={field.value}
                  options={pageTypeOptions}
                  onChange={field.onChange}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="isFixedAmount"
            render={({ field }) => (
              <Switch
                label="Fixed Amount"
                description="Customers cannot edit the payment amount."
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="allowMultiplePayments"
            render={({ field }) => (
              <Switch
                label="Allow Multiple Payments"
                description="Customers can reuse this payment link."
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="collectCustomerName"
            render={({ field }) => (
              <Switch
                label="Collect Customer Name"
                description="Request the customer's name during payment."
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="collectCustomerEmail"
            render={({ field }) => (
              <Switch
                label="Collect Customer Email"
                description="Request the customer's email during payment."
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="isPhoneNumberRequired"
            render={({ field }) => (
              <Switch
                label="Collect Phone Number"
                description="Require customers to provide their phone number."
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="isTestMode"
            render={({ field }) => (
              <Switch
                label="Test Mode"
                description="Use this payment page for testing only."
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="redirectUrl"
            render={({ field, fieldState }) => (
              <Input
                label="Redirect URL (Optional)"
                placeholder="https://example.com"
                value={field.value}
                onChangeText={field.onChange}
                autoCapitalize="none"
                keyboardType="url"
                error={fieldState.error?.message}
              />
            )}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <Divider />

      <AddPaymentLinkFooter
        primaryLabel="Next"
        secondaryLabel="Back"
        onPrimary={handleSubmit(onSubmit)}
        onSecondary={handleBack}
      />
    </SafeAreaView>
  );
}