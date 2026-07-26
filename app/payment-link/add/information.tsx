import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AppText } from "@/components/ui/AppText";
import { Divider } from "@/components/ui/Divider";
import { Dropdown } from "@/components/ui/Dropdown";
import { Input } from "@/components/ui/Input";

import { AddPaymentLinkHeader } from "@/components/payment-links/AddPaymentLinkHeader";
import { AddPaymentLinkFooter } from "@/components/payment-links/AddPaymentLinkFooter";

import { ROUTES } from "@/navigation/routes";

import { spacing, theme } from "@/theme";

import {
  paymentLinkInfoSchema,
  PaymentLinkInfoForm,
} from "@/schemas/paymentLinkInfoSchema";

import { usePaymentLink } from "@/hooks/usePaymentLink";

const currencyOptions = [
  {
    label: "Nigerian Naira (₦)",
    value: "NGN",
  },
  {
    label: "US Dollar ($)",
    value: "USD",
  },
  {
    label: "British Pound (£)",
    value: "GBP",
  },
  {
    label: "Euro (€)",
    value: "EUR",
  },
];

export default function PaymentLinkInformationScreen() {
  const { paymentLink, updatePaymentLink } = usePaymentLink();

  const {
    control,
    handleSubmit,
  } = useForm<PaymentLinkInfoForm>({
    resolver: zodResolver(paymentLinkInfoSchema),

    defaultValues: {
      linkName: paymentLink.linkName,
      amount: paymentLink.amount,
      currency: paymentLink.currency,
      description: paymentLink.description,
    },
  });

  function handleNext(data: PaymentLinkInfoForm) {
    updatePaymentLink({
      linkName: data.linkName,
      amount: data.amount,
      currency: data.currency,
      description: data.description,
    });

    router.push(ROUTES.ADD_PAYMENT_LINK_SETTINGS);
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
        step={1}
        totalSteps={3}
        progress={33}
        label="Information"
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
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.xl,
          }}
          showsVerticalScrollIndicator={false}
        >
          <AppText
            variant="body"
            color="secondary"
          >
            Generate a secure payment link customers can use to pay online.
          </AppText>

          <View
            style={{
              marginTop: spacing.lg,
            }}
          >
            <Controller
              control={control}
              name="linkName"
              render={({
                field: {
                  onChange,
                  value,
                },
                fieldState: {
                  error,
                },
              }) => (
                <Input
                  label="Link Name"
                  required
                  placeholder="e.g. School Fees"
                  value={value}
                  error={error?.message}
                  onChangeText={onChange}
                />
              )}
            />

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Controller
                control={control}
                name="amount"
                render={({
                  field: {
                    onChange,
                    value,
                  },
                  fieldState: {
                    error,
                  },
                }) => (
                  <Input
                    label="Amount"
                    required
                    keyboardType="numeric"
                    placeholder="0.00"
                    value={value}
                    error={error?.message}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Controller
                control={control}
                name="currency"
                render={({
                  field: {
                    onChange,
                    value,
                  },
                  fieldState: {
                    error,
                  },
                }) => (
                  <Dropdown
                    label="Currency"
                    required
                    placeholder="Select currency"
                    options={currencyOptions}
                    value={value}
                    error={error?.message}
                    onSelect={onChange}
                  />
                )}
              />
            </View>

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Controller
                control={control}
                name="description"
                render={({
                  field: {
                    onChange,
                    value,
                  },
                }) => (
                  <Input
                    label="Description"
                    optional
                    variant="textarea"
                    maxLength={250}
                    placeholder="Add a short description"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          </View>
        </ScrollView>

        <Divider />

        <AddPaymentLinkFooter
          onSaveDraft={() => {
            console.log("Save Payment Link Draft");
          }}
          onNext={handleSubmit(handleNext)}
        />
      </View>
    </SafeAreaView>
  );
}