import { useMemo, useState } from "react";
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

import { SearchableDropdown } from "@/components/ui/Dropdown/SearchableDropdown";

import {
  countryOptions,
  popularCountryOptions,
  stateOptions,
  cityOptions,
} from "@/constants/address";

import {
  CountryBottomSheet,
  StateBottomSheet,
  CityBottomSheet,
} from "@/components/bottom-sheet";

export default function CustomerAddressScreen() {
  const { customer, updateCustomer, resetCustomer } = useCustomer();

  const createCustomer = useCreateCustomer();

  const { control, handleSubmit, getValues, watch, setValue } =
    useForm<CustomerAddressForm>({
      resolver: zodResolver(customerAddressSchema),
      defaultValues: {
        country: customer.address.country,
        state: customer.address.state,
        city: customer.address.city,
        street: customer.address.street,
      },
    });

  const [countrySheetVisible, setCountrySheetVisible] = useState(false);
  const [stateSheetVisible, setStateSheetVisible] = useState(false);
  const [citySheetVisible, setCitySheetVisible] = useState(false);

  const [selectedCountry, selectedState] = watch(["country", "state"]);

  const availableStates = useMemo(() => {
    if (!selectedCountry) {
      return [];
    }

    return stateOptions.filter(
      (state) => state.countryCode === selectedCountry
    );
  }, [selectedCountry, stateOptions]);

  const availableCities = useMemo(() => {
    if (!selectedCountry || !selectedState) {
      return [];
    }

    return cityOptions.filter(
      (city) =>
        city.countryCode === selectedCountry && city.stateCode === selectedState
    );
  }, [selectedCountry, selectedState, cityOptions]);

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
                <>
                  <SearchableDropdown
                    label="Country"
                    required
                    placeholder="Select country"
                    value={value}
                    options={countryOptions}
                    error={error?.message}
                    onPress={() => setCountrySheetVisible(true)}
                  />

                  <CountryBottomSheet
                    visible={countrySheetVisible}
                    value={value}
                    options={countryOptions}
                    popularOptions={popularCountryOptions}
                    onSelect={(country) => {
                      if (country === value) return;

                      onChange(country);

                      setValue("state", "", {
                        shouldValidate: true,
                      });

                      setValue("city", "", {
                        shouldValidate: true,
                      });
                    }}
                    onClose={() => setCountrySheetVisible(false)}
                  />
                </>
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
                  <>
                    <SearchableDropdown
                      label="State"
                      required
                      placeholder="Select state"
                      value={value}
                      options={availableStates}
                      error={error?.message}
                      disabled={!selectedCountry}
                      onPress={() => {
                        if (!selectedCountry) return;

                        setStateSheetVisible(true);
                      }}
                    />

                    <StateBottomSheet
                      visible={stateSheetVisible}
                      countryCode={selectedCountry}
                      value={value}
                      options={stateOptions}
                      onSelect={(state) => {
                        if (state === value) return;

                        onChange(state);

                        setValue("city", "", {
                          shouldValidate: true,
                        });
                      }}
                      onClose={() => setStateSheetVisible(false)}
                    />
                  </>
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
                  <>
                    <SearchableDropdown
                      label="City"
                      required
                      placeholder="Select city"
                      value={value}
                      options={availableCities}
                      error={error?.message}
                      disabled={!selectedState}
                      onPress={() => {
                        if (!selectedState) return;

                        setCitySheetVisible(true);
                      }}
                    />

                    <CityBottomSheet
                      visible={citySheetVisible}
                      countryCode={selectedCountry}
                      stateCode={selectedState}
                      value={value}
                      options={cityOptions}
                      onSelect={(city) => {
                        if (city === value) return;

                        onChange(city);
                      }}
                      onClose={() => setCitySheetVisible(false)}
                    />
                  </>
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
