import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router, useLocalSearchParams } from "expo-router";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { AppText } from "@/components/ui/AppText";
import { Input } from "@/components/ui/Input";
import { Dropdown, type DropdownOption } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";

import { ScreenHeader } from "@/components/common/ScreenHeader";

import { spacing, theme } from "@/theme";

import { useStore } from "@/hooks/store/useStore";
import { useUpdateStore } from "@/hooks/store/useUpdateStore";

import type { UpdateStoreRequest } from "@/types/store";

/**
 * ============================================================================
 * FORM TYPES
 * ============================================================================
 */

interface EditStoreForm {
  storeName: string;

  storeReference: string;

  currency: string;

  description: string;

  welcomeMessage: string;

  themeColor: string;

  callBackUrl: string;

  successMessage: string;

  whatsAppNumber: string;

  phoneNumber: string;

  email: string;

  instagram: string;

  facebook: string;

  twitter: string;
}

/**
 * ============================================================================
 * CURRENCY OPTIONS
 * ============================================================================
 */

const currencyOptions: DropdownOption<string>[] = [
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

/**
 * ============================================================================
 * DEFAULT FORM VALUES
 * ============================================================================
 */

const emptyFormValues: EditStoreForm = {
  storeName: "",

  storeReference: "",

  currency: "NGN",

  description: "",

  welcomeMessage: "",

  themeColor: "",

  callBackUrl: "",

  successMessage: "",

  whatsAppNumber: "",

  phoneNumber: "",

  email: "",

  instagram: "",

  facebook: "",

  twitter: "",
};

/**
 * ============================================================================
 * EDIT STORE SCREEN
 * ============================================================================
 */

export default function EditStoreScreen() {
  /**
   * --------------------------------------------------------------------------
   * ROUTE PARAMETER
   * --------------------------------------------------------------------------
   */

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const storeId = Number(id);

  /**
   * --------------------------------------------------------------------------
   * STORE
   * --------------------------------------------------------------------------
   */

  const { store, isLoading, error, refetch } = useStore({
    storeId,
  });

  /**
   * --------------------------------------------------------------------------
   * UPDATE STORE
   * --------------------------------------------------------------------------
   */

  const updateStoreMutation = useUpdateStore();

  /**
   * --------------------------------------------------------------------------
   * FORM
   * --------------------------------------------------------------------------
   *
   * We intentionally initialize the form with empty values.
   *
   * The actual values are populated after the store query succeeds.
   */

  const { control, handleSubmit, reset } = useForm<EditStoreForm>({
    defaultValues: emptyFormValues,

    /**
     * If you already have an edit-store Zod schema in your project,
     * replace this with:
     *
     * resolver: zodResolver(editStoreSchema),
     */
  });

  /**
   * --------------------------------------------------------------------------
   * POPULATE FORM
   * --------------------------------------------------------------------------
   *
   * NOTE:
   *
   * React Hook Form's reset() should be used when asynchronous store data
   * arrives rather than relying on defaultValues.
   */

  /**
   * If your existing implementation already has a useEffect that resets
   * the form when `store` changes, keep that implementation.
   *
   * The important values are:
   *
   * store.storeName
   * store.storeReference
   * store.currency
   * store.description
   * store.welcomeMessage
   * store.themeColor
   * store.callBackUrl
   * store.successMessage
   * store.whatsAppNumber
   * store.phoneNumber
   * store.email
   * store.instagram
   * store.facebook
   * store.twitter
   */

  /**
   * --------------------------------------------------------------------------
   * UPDATE
   * --------------------------------------------------------------------------
   */

  function handleUpdateStore(formData: EditStoreForm) {
    /**
     * IMPORTANT:
     *
     * The store query can still be undefined when this function is called.
     *
     * Guarding here removes all TS18048 errors and prevents an invalid
     * update request from being sent.
     */

    if (!store) {
      Alert.alert(
        "Store unavailable",
        "We couldn't load this store. Please try again."
      );

      return;
    }

    /**
     * ------------------------------------------------------------------------
     * STORE LINK
     * ------------------------------------------------------------------------
     */

    const storeReference = formData.storeReference.trim().toLowerCase();

    const storeLink =
      store.storeLink ||
      `https://storelink.myxpresspay.com/store/${storeReference}`;

    /**
     * ------------------------------------------------------------------------
     * UPDATE PAYLOAD
     * ------------------------------------------------------------------------
     */

    const payload: UpdateStoreRequest = {
      id: store.storeId,

      storeName: formData.storeName.trim(),

      currency: formData.currency,

      storeReference,

      storeLink,

      isActive: store.isActive,

      themeColor: formData.themeColor.trim() || undefined,

      welcomeMessage: formData.welcomeMessage.trim() || undefined,

      description: formData.description.trim() || undefined,

      callBackUrl: formData.callBackUrl.trim() || undefined,

      successMessage: formData.successMessage.trim() || undefined,

      whatsAppNumber: formData.whatsAppNumber.trim() || undefined,

      phoneNumber: formData.phoneNumber.trim() || undefined,

      email: formData.email.trim() || undefined,

      instagram: formData.instagram.trim() || undefined,

      facebook: formData.facebook.trim() || undefined,

      twitter: formData.twitter.trim() || undefined,

      storeProducts: store.products ?? [],

      storeDiscounts: store.discounts ?? [],
    };

    /**
     * ------------------------------------------------------------------------
     * SUBMIT
     * ------------------------------------------------------------------------
     */

    updateStoreMutation.mutate(payload, {
      onSuccess: (response) => {
        if (response.responseCode !== "00") {
          Alert.alert(
            "Unable to update store",
            response.responseMessage ||
              "Something went wrong while updating your store."
          );

          return;
        }

        Alert.alert(
          "Store updated",
          "Your storefront has been updated successfully.",
          [
            {
              text: "OK",

              onPress: () => {
                router.back();
              },
            },
          ]
        );
      },

      onError: (mutationError) => {
        console.error("Unable to update store:", mutationError);

        Alert.alert(
          "Update failed",
          "We couldn't update your storefront. Please try again."
        );
      },
    });
  }

  /**
   * --------------------------------------------------------------------------
   * INVALID STORE ID
   * --------------------------------------------------------------------------
   */

  if (!Number.isFinite(storeId)) {
    return (
      <SafeAreaView
        style={{
          flex: 1,

          backgroundColor: theme.background.primary,
        }}
      >
        <StatusBar style="auto" />

        <View
          style={{
            flex: 1,

            justifyContent: "center",

            alignItems: "center",

            paddingHorizontal: spacing.lg,
          }}
        >
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={theme.icon.error.icon}
          />

          <AppText
            variant="h3"
            style={{
              marginTop: spacing.md,

              textAlign: "center",
            }}
          >
            Invalid Store
          </AppText>

          <AppText
            variant="body"
            color="secondary"
            style={{
              marginTop: spacing.sm,

              textAlign: "center",
            }}
          >
            We couldn't determine which storefront you want to edit.
          </AppText>

          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={{
              marginTop: spacing.lg,
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  /**
   * --------------------------------------------------------------------------
   * LOADING
   * --------------------------------------------------------------------------
   */

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,

          backgroundColor: theme.background.primary,
        }}
      >
        <StatusBar style="auto" />

        <View
          style={{
            flex: 1,

            justifyContent: "center",

            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={theme.icon.branding.icon} />

          <AppText
            variant="body"
            color="secondary"
            style={{
              marginTop: spacing.md,
            }}
          >
            Loading store...
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * --------------------------------------------------------------------------
   * STORE NOT FOUND
   * --------------------------------------------------------------------------
   */

  if (!store) {
    return (
      <SafeAreaView
        style={{
          flex: 1,

          backgroundColor: theme.background.primary,
        }}
      >
        <StatusBar style="auto" />

        <View
          style={{
            flex: 1,

            justifyContent: "center",

            alignItems: "center",

            paddingHorizontal: spacing.lg,
          }}
        >
          <Ionicons
            name="storefront-outline"
            size={48}
            color={theme.icon.default.icon}
          />

          <AppText
            variant="h3"
            style={{
              marginTop: spacing.md,

              textAlign: "center",
            }}
          >
            Store not found
          </AppText>

          <AppText
            variant="body"
            color="secondary"
            style={{
              marginTop: spacing.sm,

              textAlign: "center",
            }}
          >
            We couldn't find the storefront you're trying to edit.
          </AppText>

          {error && (
            <AppText
              variant="caption"
              color="error"
              style={{
                marginTop: spacing.sm,

                textAlign: "center",
              }}
            >
              Please check your connection and try again.
            </AppText>
          )}

          <View
            style={{
              flexDirection: "row",

              gap: spacing.sm,

              marginTop: spacing.lg,
            }}
          >
            <Button title="Try Again" onPress={() => refetch()} />

            <Button
              title="Go Back"
              variant="secondary"
              onPress={() => router.back()}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * --------------------------------------------------------------------------
   * FORM CONTENT
   * --------------------------------------------------------------------------
   *
   * At this point TypeScript knows:
   *
   * store: Store
   *
   * rather than:
   *
   * store: Store | undefined
   */

  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor: theme.background.primary,
      }}
      edges={["top"]}
    >
      <StatusBar style="auto" />

      <View
        style={{
          flex: 1,

          backgroundColor: theme.background.primary,
        }}
      >
        {/* ================================================================== */}
        {/* HEADER */}
        {/* ================================================================== */}

        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={10}
              onPress={() => router.back()}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.icon.default.icon}
              />
            </Pressable>

            <View
              style={{
                flex: 1,
              }}
            >
              <AppText variant="h1">Edit Store</AppText>

              <AppText
                variant="body"
                color="secondary"
                style={{
                  marginTop: spacing.xs,
                }}
              >
                Update your storefront information and settings.
              </AppText>
            </View>
          </View>
        </View>

        <Divider />

        {/* ================================================================== */}
        {/* FORM */}
        {/* ================================================================== */}

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
          {/* ================================================================ */}
          {/* STORE INFORMATION */}
          {/* ================================================================ */}

          <AppText
            variant="h3"
            style={{
              marginBottom: spacing.md,
            }}
          >
            Store Information
          </AppText>

          {/* STORE NAME */}

          <Controller
            control={control}
            name="storeName"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Store Name"
                required
                placeholder="e.g. My Fashion Store"
                value={value || store.storeName}
                onChangeText={onChange}
              />
            )}
          />

          {/* STORE REFERENCE */}

          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <Controller
              control={control}
              name="storeReference"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Store Reference"
                  required
                  placeholder="e.g. my-fashion-store"
                  autoCapitalize="none"
                  value={value || store.storeReference}
                  onChangeText={(text) =>
                    onChange(text.toLowerCase().replace(/\s+/g, "-"))
                  }
                />
              )}
            />

            <AppText
              variant="caption"
              color="secondary"
              style={{
                marginTop: spacing.xs,
              }}
            >
              This becomes part of your storefront URL.
            </AppText>
          </View>

          {/* CURRENCY */}

          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <Controller
              control={control}
              name="currency"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label="Currency"
                  required
                  placeholder="Select currency"
                  options={currencyOptions}
                  value={value || store.currency}
                  onSelect={onChange}
                />
              )}
            />
          </View>

          {/* DESCRIPTION */}

          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Description"
                  optional
                  variant="textarea"
                  maxLength={250}
                  placeholder="Tell customers about your store"
                  value={value || store.description || ""}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* WELCOME MESSAGE */}

          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <Controller
              control={control}
              name="welcomeMessage"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Welcome Message"
                  optional
                  variant="textarea"
                  maxLength={250}
                  placeholder="e.g. Welcome to our store!"
                  value={value || store.welcomeMessage || ""}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* ================================================================ */}
          {/* STOREFRONT SETTINGS */}
          {/* ================================================================ */}

          <View
            style={{
              marginTop: spacing.xl,
            }}
          >
            <AppText variant="h3">Storefront Settings</AppText>
          </View>

          {/* THEME COLOR */}

          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <Controller
              control={control}
              name="themeColor"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Theme Color"
                  optional
                  placeholder="#0F4082"
                  autoCapitalize="none"
                  value={value || store.themeColor || ""}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* CALLBACK URL */}

          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <Controller
              control={control}
              name="callBackUrl"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Callback URL"
                  optional
                  placeholder="https://example.com/callback"
                  autoCapitalize="none"
                  keyboardType="url"
                  value={value || store.callBackUrl || ""}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* SUCCESS MESSAGE */}

          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <Controller
              control={control}
              name="successMessage"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Success Message"
                  optional
                  placeholder="Thank you for your order!"
                  value={value || store.successMessage || ""}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* ================================================================ */}
          {/* CONTACT INFORMATION */}
          {/* ================================================================ */}

          <View
            style={{
              marginTop: spacing.xl,
            }}
          >
            <AppText variant="h3">Contact Information</AppText>
          </View>

          {/* WHATSAPP */}

          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <Controller
              control={control}
              name="whatsAppNumber"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="WhatsApp Number"
                  optional
                  placeholder="+2348012345678"
                  keyboardType="phone-pad"
                  value={value || store.whatsAppNumber || ""}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* PHONE */}

          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Phone Number"
                  optional
                  placeholder="+2348012345678"
                  keyboardType="phone-pad"
                  value={value || store.phoneNumber || ""}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* EMAIL */}

          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Email"
                  optional
                  placeholder="store@example.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={value || store.email || ""}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* ================================================================ */}
          {/* SOCIAL MEDIA */}
          {/* ================================================================ */}

          <View
            style={{
              marginTop: spacing.xl,
            }}
          >
            <AppText variant="h3">Social Media</AppText>
          </View>

          {/* INSTAGRAM */}

          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <Controller
              control={control}
              name="instagram"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Instagram"
                  optional
                  placeholder="mystore_ig"
                  autoCapitalize="none"
                  value={value || store.instagram || ""}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* FACEBOOK */}

          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <Controller
              control={control}
              name="facebook"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Facebook"
                  optional
                  placeholder="mystore_fb"
                  autoCapitalize="none"
                  value={value || store.facebook || ""}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* TWITTER */}

          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <Controller
              control={control}
              name="twitter"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Twitter / X"
                  optional
                  placeholder="mystore_tw"
                  autoCapitalize="none"
                  value={value || store.twitter || ""}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* ================================================================ */}
          {/* CURRENT STORE */}
          {/* ================================================================ */}

          <View
            style={{
              marginTop: spacing.xl,
            }}
          >
            <Card
              style={{
                backgroundColor: theme.background.brand,
              }}
            >
              <View
                style={{
                  flexDirection: "row",

                  alignItems: "center",

                  gap: spacing.sm,
                }}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={theme.icon.branding.icon}
                />

                <View
                  style={{
                    flex: 1,

                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodyBold">Store status</AppText>

                  <AppText variant="bodySmall" color="secondary">
                    {store.isActive
                      ? "Your storefront is currently live."
                      : "Your storefront is currently offline."}
                  </AppText>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>

        {/* ================================================================== */}
        {/* FOOTER */}
        {/* ================================================================== */}

        <Divider />

        <View
          style={{
            flexDirection: "row",

            gap: spacing.sm,

            paddingHorizontal: spacing.lg,

            paddingVertical: spacing.md,
          }}
        >
          <Button
            title="Cancel"
            variant='tertiary'
            onPress={() => router.back()}
            disabled={updateStoreMutation.isPending}
            style={{
              flex: 1,
            }}
          />

          <Button
            title={
              updateStoreMutation.isPending ? "Updating..." : "Save Changes"
            }
            onPress={handleSubmit(handleUpdateStore)}
            disabled={updateStoreMutation.isPending}
            style={{
              flex: 1,
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
