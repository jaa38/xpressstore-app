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

import type {
  PaymentLinkType,
} from "@/types/paymentLink";

/**
 * ---------------------------------------------------------------------------
 * Payment Page Type
 * ---------------------------------------------------------------------------
 *
 * These values are supported by the current Payment Pages backend contract.
 *
 * - single
 * - donation
 */
const pageTypeOptions: {
  label: string;
  value: PaymentLinkType;
}[] = [
  {
    label: "Single Payment",
    value: "single",
  },
  {
    label: "Donation",
    value: "donation",
  },
];

/**
 * ---------------------------------------------------------------------------
 * Payment Type
 * ---------------------------------------------------------------------------
 *
 * Future backend field.
 *
 * This remains in the UI and Zustand draft but is NOT sent to the current
 * Payment Pages API.
 */
type FuturePaymentType =
  | "one-time"
  | "subscription";

const paymentTypeOptions: {
  label: string;
  value: FuturePaymentType;
}[] = [
  {
    label: "One-time Payment",
    value: "one-time",
  },
  {
    label: "Subscription Payment",
    value: "subscription",
  },
];

export default function PaymentLinkSettingsScreen() {
  const {
    paymentLink,
    updatePaymentLink,
  } = usePaymentLink();

  const {
    control,
    handleSubmit,
    getValues,
  } = useForm<PaymentLinkSettingsForm>({
    resolver: zodResolver(
      paymentLinkSettingsSchema
    ),

    defaultValues: {
      /**
       * Future backend field.
       */
      expiryDate:
        paymentLink.expiryDate,

      /**
       * Backend-supported field.
       */
      pageType:
        paymentLink.pageType,

      /**
       * Future backend field.
       */
      paymentType:
        paymentLink.paymentType,

      /**
       * Backend-supported field.
       */
      isFixedAmount:
        paymentLink.isFixedAmount,

      /**
       * Future backend field.
       */
      allowMultiplePayments:
        paymentLink.allowMultiplePayments,

      /**
       * Future backend field.
       */
      collectCustomerName:
        paymentLink.collectCustomerName,

      /**
       * Future backend field.
       */
      collectCustomerEmail:
        paymentLink.collectCustomerEmail,

      /**
       * Backend-supported field.
       */
      isPhoneNumberRequired:
        paymentLink.isPhoneNumberRequired,

      /**
       * Backend-supported field.
       */
      isTestMode:
        paymentLink.isTestMode,

      /**
       * Backend-supported field.
       */
      redirectUrl:
        paymentLink.redirectUrl,

      /**
       * Backend-supported optional fields.
       */
      subAccountId:
        paymentLink.subAccountId,

      subAccountGroupId:
        paymentLink.subAccountGroupId,

      extraFields:
        paymentLink.extraFields,
    },
  });

  function onSubmit(
    data: PaymentLinkSettingsForm
  ) {
    updatePaymentLink(data);

    router.push(
      ROUTES.ADD_PAYMENT_LINK_REVIEW
    );
  }

  function handleBack() {
    updatePaymentLink(
      getValues()
    );

    router.back();
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          theme.background.primary,
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
        style={{
          flex: 1,
        }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
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
            Configure how customers can use
            this payment link.
          </AppText>

          {/* -----------------------------------------------------------------
              Expiry Date
              Future backend field - UI retained
          ----------------------------------------------------------------- */}

          <Controller
            control={control}
            name="expiryDate"
            render={({
              field,
              fieldState,
            }) => (
              <DatePicker
                label="Expiry Date"
                value={
                  field.value ??
                  undefined
                }
                minimumDate={
                  new Date()
                }
                error={
                  fieldState.error
                    ?.message
                }
                onChange={
                  field.onChange
                }
              />
            )}
          />

          {/* -----------------------------------------------------------------
              Payment Page Type
              Backend-supported field
          ----------------------------------------------------------------- */}

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
                  value={
                    field.value
                  }
                  options={
                    pageTypeOptions
                  }
                  onChange={
                    field.onChange
                  }
                />
              </View>
            )}
          />

          {/* -----------------------------------------------------------------
              Payment Type
              Future backend field - UI retained
          ----------------------------------------------------------------- */}

          <Controller
            control={control}
            name="paymentType"
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
                  Payment Type
                </AppText>

                <RadioGroup
                  value={
                    field.value
                  }
                  options={
                    paymentTypeOptions
                  }
                  onChange={
                    field.onChange
                  }
                />
              </View>
            )}
          />

          {/* -----------------------------------------------------------------
              Fixed Amount
              Backend-supported field
          ----------------------------------------------------------------- */}

          <Controller
            control={control}
            name="isFixedAmount"
            render={({ field }) => (
              <Switch
                label="Fixed Amount"
                description="Customers cannot edit the payment amount."
                value={
                  field.value
                }
                onValueChange={
                  field.onChange
                }
              />
            )}
          />

          {/* -----------------------------------------------------------------
              Allow Multiple Payments
              Future backend field - UI retained
          ----------------------------------------------------------------- */}

          <Controller
            control={control}
            name="allowMultiplePayments"
            render={({ field }) => (
              <Switch
                label="Allow Multiple Payments"
                description="Customers can reuse this payment link."
                value={
                  field.value
                }
                onValueChange={
                  field.onChange
                }
              />
            )}
          />

          {/* -----------------------------------------------------------------
              Collect Customer Name
              Future backend field - UI retained
          ----------------------------------------------------------------- */}

          <Controller
            control={control}
            name="collectCustomerName"
            render={({ field }) => (
              <Switch
                label="Collect Customer Name"
                description="Request the customer's name during payment."
                value={
                  field.value
                }
                onValueChange={
                  field.onChange
                }
              />
            )}
          />

          {/* -----------------------------------------------------------------
              Collect Customer Email
              Future backend field - UI retained
          ----------------------------------------------------------------- */}

          <Controller
            control={control}
            name="collectCustomerEmail"
            render={({ field }) => (
              <Switch
                label="Collect Customer Email"
                description="Request the customer's email during payment."
                value={
                  field.value
                }
                onValueChange={
                  field.onChange
                }
              />
            )}
          />

          {/* -----------------------------------------------------------------
              Collect Phone Number
              Backend-supported field
          ----------------------------------------------------------------- */}

          <Controller
            control={control}
            name="isPhoneNumberRequired"
            render={({ field }) => (
              <Switch
                label="Collect Phone Number"
                description="Require customers to provide their phone number."
                value={
                  field.value
                }
                onValueChange={
                  field.onChange
                }
              />
            )}
          />

          {/* -----------------------------------------------------------------
              Test Mode
              Backend-supported field
          ----------------------------------------------------------------- */}

          <Controller
            control={control}
            name="isTestMode"
            render={({ field }) => (
              <Switch
                label="Test Mode"
                description="Use this payment page for testing only."
                value={
                  field.value
                }
                onValueChange={
                  field.onChange
                }
              />
            )}
          />

          {/* -----------------------------------------------------------------
              Redirect URL
              Backend-supported field
          ----------------------------------------------------------------- */}

          <Controller
            control={control}
            name="redirectUrl"
            render={({
              field,
              fieldState,
            }) => (
              <Input
                label="Redirect URL (Optional)"
                placeholder="https://example.com"
                value={
                  field.value
                }
                onChangeText={
                  field.onChange
                }
                autoCapitalize="none"
                keyboardType="url"
                error={
                  fieldState.error
                    ?.message
                }
              />
            )}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <Divider />

      <AddPaymentLinkFooter
        primaryLabel="Next"
        secondaryLabel="Back"
        onPrimary={handleSubmit(
          onSubmit
        )}
        onSecondary={
          handleBack
        }
      />
    </SafeAreaView>
  );
}