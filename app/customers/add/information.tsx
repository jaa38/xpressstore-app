import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AppText } from "@/components/ui/AppText";
import { Divider } from "@/components/ui/Divider";
import { Input } from "@/components/ui/Input";
import {
  Dropdown,
  type DropdownOption,
} from "@/components/ui/Dropdown";

import { AddCustomerHeader } from "@/components/customers/AddCustomerHeader";
import { AddCustomerFooter } from "@/components/customers/AddCustomerFooter";

import { useCustomer } from "@/hooks/customers/useCustomer";

import { ROUTES } from "@/navigation/routes";

import { spacing, theme } from "@/theme";

import {
  customerInformationSchema,
  type CustomerInformationForm,
} from "@/schemas/customerInformationSchema";

import { countryOptions } from "@/constants/address/countries";

const customerTypeOptions: DropdownOption<
  "individual" | "business"
>[] = [
  {
    label: "Individual",
    value: "individual",
  },
  {
    label: "Business",
    value: "business",
  },
];

export default function CustomerInformationScreen() {
  const { customer, updateCustomer } = useCustomer();

  const {
    control,
    handleSubmit,
    getValues,
  } = useForm<CustomerInformationForm>({
    resolver: zodResolver(customerInformationSchema),

    defaultValues: {
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      customerType: customer.customerType,
    },
  });

  function onSubmit(data: CustomerInformationForm) {
    updateCustomer(data);

    router.push(ROUTES.ADD_CUSTOMER_ADDRESS);
  }

  function handleSaveDraft() {
    updateCustomer(getValues());

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
      <AddCustomerHeader
        title="Create Customer"
        step={1}
        totalSteps={2}
        progress={50}
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.xl,
          }}
        >
          <AppText
            variant="body"
            color="secondary"
          >
            Add your customer's contact information.
          </AppText>

          <View
            style={{
              marginTop: spacing.lg,
            }}
          >
            {/* Customer Name */}

            <Controller
              control={control}
              name="name"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  label="Customer Name"
                  required
                  placeholder="John Doe"
                  value={value}
                  error={error?.message}
                  onChangeText={onChange}
                />
              )}
            />

            {/* Phone */}

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Controller
                control={control}
                name="phone"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Input
                    label="Phone Number"
                    required
                    keyboardType="phone-pad"
                    placeholder="+234 801 234 5678"
                    value={value}
                    error={error?.message}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>

            {/* Email */}

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Controller
                control={control}
                name="email"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Input
                    label="Email Address"
                    optional
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="john@example.com"
                    value={value}
                    error={error?.message}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>

            {/* Customer Type */}

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Controller
                control={control}
                name="customerType"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Dropdown
                    label="Customer Type"
                    required
                    placeholder="Select customer type"
                    options={customerTypeOptions}
                    value={value}
                    error={error?.message}
                    onSelect={onChange}
                  />
                )}
              />
            </View>
          </View>
        </ScrollView>

        <Divider />

        <AddCustomerFooter
          primaryLabel="Next"
          secondaryLabel="Save as Draft"
          onPrimary={handleSubmit(onSubmit)}
          onSecondary={handleSaveDraft}
        />
      </View>
    </SafeAreaView>
  );
}