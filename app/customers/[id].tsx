import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  BackHandler,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { Divider } from "@/components/ui/Divider";
import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { useCustomerById } from "@/hooks/customers/useCustomerById";

import { useEffect, useState, useCallback } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  editCustomerSchema,
  EditCustomerForm,
} from "@/schemas/editCustomerSchema";

import { Controller } from "react-hook-form";

import { Input } from "@/components/ui/Input";
import { Dropdown } from "@/components/ui/Dropdown";

import { useMemo } from "react";

import { SearchableDropdown } from "@/components/ui/Dropdown/SearchableDropdown";

import { CountryBottomSheet } from "@/components/bottom-sheet/CountryBottomSheet";
import { StateBottomSheet } from "@/components/bottom-sheet/StateBottomSheet";
import { CityBottomSheet } from "@/components/bottom-sheet/CityBottomSheet";

import { countryOptions } from "@/constants/address/countries";

import { stateOptions } from "@/constants/address/states";
import { cityOptions } from "@/constants/address/cities";

import { useToast } from "@/hooks/useToast";
import { useUpdateCustomer } from "@/hooks/customers/useUpdateCustomer";

import { Button } from "@/components/ui/Button";

export default function CustomerDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { data: customer, isLoading } = useCustomerById(id);

  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty, isValid },
  } = useForm<EditCustomerForm>({
    resolver: zodResolver(editCustomerSchema),

    defaultValues: {
      name: "",
      phone: "",
      email: "",

      customerType: "individual",

      country: "",
      state: "",
      city: "",
      street: "",
    },
  });

  const CUSTOMER_TYPE_OPTIONS = [
    {
      label: "Individual",
      value: "individual",
    },
    {
      label: "Business",
      value: "business",
    },
  ];

  const selectedCountry = watch("country");

  const selectedState = watch("state");

  const selectedCity = watch("city");

  const [countryVisible, setCountryVisible] = useState(false);

  const [stateVisible, setStateVisible] = useState(false);

  const [cityVisible, setCityVisible] = useState(false);

  const filteredStates = useMemo(() => {
    if (!selectedCountry) {
      return [];
    }

    return stateOptions.filter(
      (state) => state.countryCode === selectedCountry
    );
  }, [selectedCountry]);

  const filteredCities = useMemo(() => {
    if (!selectedState) {
      return [];
    }

    return cityOptions.filter((city) => city.stateCode === selectedState);
  }, [selectedState]);

  const [hasSaved, setHasSaved] = useState(false);

  const updateCustomerMutation = useUpdateCustomer();

  const { showToast } = useToast();

  const saving = updateCustomerMutation.isPending;

  async function handleUpdateCustomer(data: EditCustomerForm) {
    if (saving) {
      return;
    }

    try {
      await updateCustomerMutation.mutateAsync({
        id,
        customer: {
          name: data.name.trim(),
          phone: data.phone.trim(),
          email: data.email.trim(),

          customerType: data.customerType,

          country: data.country,
          state: data.state,
          city: data.city,
          street: data.street.trim(),
        },
      });

      showToast({
        type: "success",
        title: "Customer Updated",
        message: "Changes saved successfully.",
      });

      // Treat the saved values as the new defaults
      reset(data);

      // Prevent the discard confirmation after saving
      setHasSaved(true);
    } catch (error) {
      console.error(error);

      showToast({
        type: "error",
        title: "Update Failed",
        message: "Please try again.",
      });
    }
  }

  function confirmDiscardChanges(onDiscard: () => void) {
    if (!isDirty || hasSaved) {
      onDiscard();
      return;
    }

    Alert.alert(
      "Discard Changes?",
      "You have unsaved changes. Are you sure you want to leave?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Discard",
          style: "destructive",
          onPress: onDiscard,
        },
      ]
    );
  }

  useEffect(() => {
    if (!customer) {
      return;
    }

    reset({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,

      customerType: customer.customerType,

      country: customer.country,
      state: customer.state,
      city: customer.city,
      street: customer.street,
    });
  }, [customer, reset]);

  useEffect(() => {
    if (isDirty && hasSaved) {
      setHasSaved(false);
    }
  }, [isDirty, hasSaved]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (!isDirty) {
            return false;
          }

          confirmDiscardChanges(() => {
            router.back();
          });

          return true;
        }
      );

      return () => subscription.remove();
    }, [isDirty, hasSaved, router])
  );

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background.primary,
        }}
      >
        <ActivityIndicator size="large" color={theme.icon.branding.icon} />

        <AppText
          style={{
            marginTop: spacing.md,
          }}
        >
          Loading customer...
        </AppText>
      </SafeAreaView>
    );
  }

  if (!customer) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: spacing.lg,
          backgroundColor: theme.background.primary,
        }}
      >
        <AppText
          variant="h2"
          style={{
            marginBottom: spacing.sm,
          }}
        >
          Customer not found
        </AppText>

        <AppText
          style={{
            textAlign: "center",
            marginBottom: spacing.lg,
          }}
        >
          The customer you're trying to edit no longer exists.
        </AppText>

        <Button title="Go Back" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
    >
      <ScreenHeader
        title="Edit Customer"
        onBack={() =>
          confirmDiscardChanges(() => {
            router.back();
          })
        }
      />
      <Divider />

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
        <View
          style={{
            gap: spacing.md,
          }}
        >
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                label="Customer Name"
                required
                value={value}
                error={error?.message}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                label="Phone Number"
                required
                keyboardType="phone-pad"
                value={value}
                error={error?.message}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                label="Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                error={error?.message}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="customerType"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Dropdown
                label="Customer Type"
                required
                value={value}
                options={CUSTOMER_TYPE_OPTIONS}
                error={error?.message}
                placeholder="Select customer type"
                onSelect={onChange}
              />
            )}
          />

          <SearchableDropdown
            label="Country"
            required
            value={selectedCountry}
            options={countryOptions}
            placeholder="Select country"
            onPress={() => setCountryVisible(true)}
          />

          <SearchableDropdown
            label="State"
            required
            value={selectedState}
            options={filteredStates}
            placeholder="Select state"
            disabled={!selectedCountry}
            onPress={() => setStateVisible(true)}
          />

          <SearchableDropdown
            label="City"
            required
            value={selectedCity}
            options={filteredCities}
            placeholder="Select city"
            disabled={!selectedState}
            onPress={() => setCityVisible(true)}
          />

          <Controller
            control={control}
            name="street"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                label="Street Address"
                required
                value={value}
                error={error?.message}
                onChangeText={onChange}
              />
            )}
          />

          <Button
            title={saving ? "Saving..." : "Save Changes"}
            onPress={handleSubmit(handleUpdateCustomer)}
            loading={saving}
            disabled={saving || !isDirty || !isValid}
          />
        </View>
      </ScrollView>
      <CountryBottomSheet
        visible={countryVisible}
        value={selectedCountry}
        options={countryOptions}
        onClose={() => setCountryVisible(false)}
        onSelect={(country) => {
          const applyCountry = () => {
            setValue("country", country, {
              shouldDirty: true,
              shouldValidate: true,
            });

            setValue("state", "", {
              shouldDirty: true,
              shouldValidate: true,
            });

            setValue("city", "", {
              shouldDirty: true,
              shouldValidate: true,
            });
          };

          if (selectedState || selectedCity) {
            Alert.alert(
              "Change Country?",
              "Changing the country will clear the selected state and city.",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Continue",
                  onPress: applyCountry,
                },
              ]
            );
          } else {
            applyCountry();
          }
        }}
      />

      <StateBottomSheet
        visible={stateVisible}
        countryCode={selectedCountry}
        value={selectedState}
        options={stateOptions}
        onClose={() => setStateVisible(false)}
        onSelect={(state) => {
          const applyState = () => {
            setValue("state", state, {
              shouldDirty: true,
              shouldValidate: true,
            });

            setValue("city", "", {
              shouldDirty: true,
              shouldValidate: true,
            });
          };

          if (selectedCity) {
            Alert.alert(
              "Change State?",
              "Changing the state will clear the selected city.",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Continue",
                  onPress: applyState,
                },
              ]
            );
          } else {
            applyState();
          }
        }}
      />

      <CityBottomSheet
        visible={cityVisible}
        countryCode={selectedCountry}
        stateCode={selectedState}
        value={selectedCity}
        options={cityOptions}
        onClose={() => setCityVisible(false)}
        onSelect={(city) => {
          setValue("city", city, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
    </SafeAreaView>
  );
}
