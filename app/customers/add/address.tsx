import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AppText } from "@/components/ui/AppText";
import { Divider } from "@/components/ui/Divider";
import { Input } from "@/components/ui/Input";

import { AddCustomerHeader } from "@/components/customers/AddCustomerHeader";
import { AddCustomerFooter } from "@/components/customers/AddCustomerFooter";

import { useCustomer } from "@/hooks/customers/useCustomer";
import { useCreateCustomer } from "@/hooks/customers/useCreateCustomer";

import {
  customerAddressSchema,
  type CustomerAddressForm,
} from "@/schemas/customerAddressSchema";

import type { CreateCustomerPayload } from "@/types/customer";

import { ROUTES } from "@/navigation/routes";

import { spacing, theme } from "@/theme";

import { Dropdown } from "@/components/ui/Dropdown";

import { countryOptions } from "@/constants/countries";

export default function CustomerAddressScreen() {
  const { customer, updateCustomer, resetCustomer } = useCustomer();

  const createCustomer = useCreateCustomer();

  const { control, handleSubmit, getValues } = useForm<CustomerAddressForm>({
    resolver: zodResolver(customerAddressSchema),

    defaultValues: {
      country: customer.address.country,
      state: customer.address.state,
      city: customer.address.city,
      street: customer.address.street,
    },
  });

  function onSubmit(data: CustomerAddressForm) {
    // Keep the draft up to date
    updateCustomer({
      address: data,
    });

    const payload: CreateCustomerPayload = {
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      customerType: customer.customerType,

      country: data.country,
      state: data.state,
      city: data.city,
      street: data.street,
    };

    createCustomer.mutate(payload, {
      onSuccess: () => {
        resetCustomer();

        router.replace(ROUTES.CUSTOMERS);
      },

      onError: (error) => {
        console.error(error);
      },
    });
  }

  function handleSaveDraft() {
    updateCustomer({
      address: getValues(),
    });

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
        step={2}
        totalSteps={2}
        progress={100}
        label="Address"
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
          <AppText variant="body" color="secondary">
            Add your customer's address information.
          </AppText>

          <View
            style={{
              marginTop: spacing.lg,
            }}
          >
            {/* Country */}

            <Controller
              control={control}
              name="country"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Dropdown
                  label="Country"
                  required
                  placeholder="Select country"
                  value={value}
                  options={countryOptions}
                  error={error?.message}
                  onSelect={onChange}
                />
              )}
            />

            {/* State */}

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Controller
                control={control}
                name="state"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Input
                    label="State"
                    required
                    placeholder="Lagos"
                    value={value}
                    error={error?.message}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>

            {/* City */}

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Controller
                control={control}
                name="city"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Input
                    label="City"
                    required
                    placeholder="Ikeja"
                    value={value}
                    error={error?.message}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>

            {/* Street */}

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Controller
                control={control}
                name="street"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Input
                    label="Street Address"
                    optional
                    variant="textarea"
                    placeholder="Enter street address"
                    value={value}
                    error={error?.message}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          </View>
        </ScrollView>

        <Divider />

        <AddCustomerFooter
          primaryLabel={
            createCustomer.isPending ? "Creating..." : "Create Customer"
          }
          secondaryLabel="Save as Draft"
          onPrimary={handleSubmit(onSubmit)}
          onSecondary={handleSaveDraft}
        />
      </View>
    </SafeAreaView>
  );
}
