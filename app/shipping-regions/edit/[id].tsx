import {
  ActivityIndicator,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";

import { useCallback, useEffect, useRef } from "react";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { ScreenHeader } from "@/components/common/ScreenHeader";
import { AppText } from "@/components/ui/AppText";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Card } from "@/components/ui/Card";

import { spacing, theme, radius } from "@/theme";

import { useShippingRegions } from "@/hooks/store/useShippingRegions";
import { useUpdateShippingRegion } from "@/hooks/store/useUpdateShippingRegion";

import { useToast } from "@/hooks/useToast";

import { getShippingRegionDetailsRoute } from "@/navigation/routes";

import type {
  ShippingRegion,
  UpdateShippingRegionRequest,
} from "@/types/store";

import { z } from "zod";

/**
 * ============================================================================
 * VALIDATION
 * ============================================================================
 */

const editShippingRegionSchema = z.object({
  region: z.string().trim().min(1, "Region is required."),

  state: z.string().trim().min(1, "State is required."),

  shippingFee: z
    .string()
    .trim()
    .min(1, "Shipping fee is required.")
    .refine(
      (value) => {
        const parsed = Number(value);

        return Number.isFinite(parsed) && parsed >= 0;
      },
      {
        message: "Enter a valid shipping fee.",
      }
    ),
});

type EditShippingRegionForm = z.infer<typeof editShippingRegionSchema>;

/**
 * ============================================================================
 * EDIT SHIPPING REGION SCREEN
 * ============================================================================
 */

export default function EditShippingRegionScreen() {
  /**
   * ==========================================================================
   * ROUTE
   * ==========================================================================
   */

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const router = useRouter();

  const regionId = Number(id);

  /**
   * ==========================================================================
   * API / MOCK DATA
   * ==========================================================================
   */

  const { shippingRegions, isLoading, error, refetch } = useShippingRegions();

  /**
   * ==========================================================================
   * MUTATION
   * ==========================================================================
   */

  const updateShippingRegionMutation = useUpdateShippingRegion();

  /**
   * ==========================================================================
   * TOAST
   * ==========================================================================
   */

  const { showToast } = useToast();

  /**
   * ==========================================================================
   * FIND SHIPPING REGION
   * ==========================================================================
   */

  const shippingRegion: ShippingRegion | undefined = shippingRegions.find(
    (region) => region.id === regionId
  );

  /**
   * ==========================================================================
   * FORM INITIALIZATION
   * ==========================================================================
   */

  const hasInitializedForm = useRef(false);

  /**
   * ==========================================================================
   * FORM
   * ==========================================================================
   */

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid, errors },
  } = useForm<EditShippingRegionForm>({
    resolver: zodResolver(editShippingRegionSchema),

    mode: "onChange",

    defaultValues: {
      region: "",
      state: "",
      shippingFee: "",
    },
  });

  /**
   * ==========================================================================
   * RESET INITIALIZATION WHEN ID CHANGES
   * ==========================================================================
   */

  useEffect(() => {
    hasInitializedForm.current = false;
  }, [regionId]);

  /**
   * ==========================================================================
   * LOAD SHIPPING REGION INTO FORM
   * ==========================================================================
   */

  useEffect(() => {
    if (!shippingRegion) {
      return;
    }

    if (hasInitializedForm.current) {
      return;
    }

    reset(
      {
        region: shippingRegion.region ?? "",

        state: shippingRegion.state ?? "",

        shippingFee: String(shippingRegion.shippingFee ?? ""),
      },
      {
        keepDirty: false,
      }
    );

    hasInitializedForm.current = true;
  }, [shippingRegion, reset]);

  /**
   * ==========================================================================
   * CHANGES
   * ==========================================================================
   */

  const hasChanges = isDirty;

  /**
   * ==========================================================================
   * HARDWARE BACK BUTTON
   * ==========================================================================
   */

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (!hasChanges) {
            return false;
          }

          confirmDiscardChanges(() => {
            router.back();
          });

          return true;
        }
      );

      return () => subscription.remove();
    }, [hasChanges, router])
  );

  /**
   * ==========================================================================
   * FORM VALIDATION ERROR
   * ==========================================================================
   */

  function handleInvalidSubmit() {
    console.log("EDIT SHIPPING REGION FORM INVALID", errors);

    const firstError = Object.values(errors)[0];

    showToast({
      type: "error",

      title: "Check Shipping Region",

      message:
        firstError?.message ??
        "Please correct the highlighted fields before saving.",
    });
  }

  /**
   * ==========================================================================
   * UPDATE SHIPPING REGION
   * ==========================================================================
   */

  async function handleUpdateShippingRegion(data: EditShippingRegionForm) {
    if (updateShippingRegionMutation.isPending) {
      return;
    }

    try {
      /**
       * ======================================================================
       * PREPARE PAYLOAD
       * ======================================================================
       */

      const payload: UpdateShippingRegionRequest = {
        id: regionId,

        region: data.region.trim(),

        state: data.state.trim(),

        shippingFee: Number(data.shippingFee.trim()),
      };

      /**
       * ======================================================================
       * UPDATE
       * ======================================================================
       */

      await updateShippingRegionMutation.mutateAsync(payload);

      /**
       * ======================================================================
       * RESET FORM BASELINE
       * ======================================================================
       */

      reset(
        {
          region: data.region.trim(),

          state: data.state.trim(),

          shippingFee: data.shippingFee.trim(),
        },
        {
          keepDirty: false,
        }
      );

      /**
       * ======================================================================
       * SUCCESS
       * ======================================================================
       */

      showToast({
        type: "success",

        title: "Shipping Region Updated",

        message: `${data.region.trim()} has been updated successfully.`,
      });

      /**
       * ======================================================================
       * RETURN TO DETAILS
       * ======================================================================
       */

      router.replace(getShippingRegionDetailsRoute(regionId));
    } catch (error) {
      console.log("UPDATE SHIPPING REGION ERROR", error);

      showToast({
        type: "error",

        title: "Update Failed",

        message:
          error instanceof Error
            ? error.message
            : "Unable to update this shipping region. Please try again.",
      });
    }
  }

  /**
   * ==========================================================================
   * DISCARD CHANGES
   * ==========================================================================
   */

  function confirmDiscardChanges(onDiscard: () => void) {
    if (!hasChanges) {
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

  /**
   * ==========================================================================
   * INVALID ID
   * ==========================================================================
   */

  const invalidId = !id || !Number.isFinite(regionId) || regionId <= 0;

  /**
   * ==========================================================================
   * LOADING
   * ==========================================================================
   */

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
        <StatusBar style="auto" />

        <ActivityIndicator size="large" color={theme.icon.branding.icon} />

        <AppText
          color="secondary"
          style={{
            marginTop: spacing.md,
          }}
        >
          Loading shipping region...
        </AppText>
      </SafeAreaView>
    );
  }

  /**
   * ==========================================================================
   * NOT FOUND
   * ==========================================================================
   */

  if (invalidId || (!shippingRegion && !error)) {
    return (
      <SafeAreaView
        style={{
          flex: 1,

          backgroundColor: theme.background.primary,
        }}
      >
        <StatusBar style="auto" />

        <ScreenHeader
          title="Edit Shipping Region"
          onBack={() => router.back()}
        />

        <Divider />

        <View
          style={{
            flex: 1,

            justifyContent: "center",

            alignItems: "center",

            paddingHorizontal: spacing.xl,
          }}
        >
          <View
            style={{
              width: 64,

              height: 64,

              borderRadius: radius.full,

              backgroundColor: theme.background.subtle,

              justifyContent: "center",

              alignItems: "center",
            }}
          >
            <Ionicons
              name="location-outline"
              size={32}
              color={theme.icon.default.icon}
            />
          </View>

          <AppText
            variant="h2"
            style={{
              marginTop: spacing.lg,

              textAlign: "center",
            }}
          >
            Shipping Region Not Found
          </AppText>

          <AppText
            variant="body"
            color="secondary"
            style={{
              marginTop: spacing.sm,

              textAlign: "center",

              maxWidth: 320,
            }}
          >
            The shipping region you're trying to edit could not be found.
          </AppText>

          <Button
            title="Go Back"
            variant="tertiary"
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
   * ==========================================================================
   * ERROR
   * ==========================================================================
   */

  if (!shippingRegion) {
    return (
      <SafeAreaView
        style={{
          flex: 1,

          backgroundColor: theme.background.primary,
        }}
      >
        <StatusBar style="auto" />

        <ScreenHeader
          title="Edit Shipping Region"
          onBack={() => router.back()}
        />

        <Divider />

        <View
          style={{
            flex: 1,

            justifyContent: "center",

            alignItems: "center",

            paddingHorizontal: spacing.xl,
          }}
        >
          <View
            style={{
              width: 56,

              height: 56,

              borderRadius: radius.full,

              backgroundColor: theme.background.error,

              justifyContent: "center",

              alignItems: "center",
            }}
          >
            <Ionicons
              name="alert-circle-outline"
              size={30}
              color={theme.icon.error.icon}
            />
          </View>

          <AppText
            variant="h2"
            style={{
              marginTop: spacing.lg,

              textAlign: "center",
            }}
          >
            Unable to Load Shipping Region
          </AppText>

          <AppText
            variant="body"
            color="secondary"
            style={{
              marginTop: spacing.sm,

              textAlign: "center",

              maxWidth: 320,
            }}
          >
            We couldn't load this shipping region. Please try again.
          </AppText>

          <Button
            title="Try Again"
            variant="tertiary"
            onPress={() => refetch()}
            style={{
              marginTop: spacing.lg,
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ==========================================================================
   * UI
   * ==========================================================================
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

      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ====================================================================
            HEADER
        ==================================================================== */}

        <ScreenHeader
          title="Edit Shipping Region"
          onBack={() =>
            confirmDiscardChanges(() => {
              router.back();
            })
          }
        />

        <Divider />

        {/* ====================================================================
            CONTENT
        ==================================================================== */}

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,

            paddingTop: spacing.lg,

            paddingBottom: spacing["3xl"],
          }}
        >
          {/* ==================================================================
              INTRODUCTION
          ================================================================== */}

          <View
            style={{
              alignItems: "flex-start",

              marginBottom: spacing.lg,
            }}
          >
            <AppText
              variant="body"
              color="secondary"
              style={{
                textAlign: "left",

                maxWidth: 320,
              }}
            >
              Update this shipping region and the delivery fee customers pay for
              this area.
            </AppText>
          </View>

          {/* ==================================================================
              SHIPPING REGION INFORMATION
          ================================================================== */}

          <Card>
            <View
              style={{
                gap: spacing.lg,
              }}
            >
              {/* ==============================================================
                  SECTION HEADER
              ============================================================== */}

              <View
                style={{
                  flexDirection: "row",

                  alignItems: "center",

                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    width: 44,

                    height: 44,

                    borderRadius: radius.md,

                    backgroundColor: theme.background.subtle,

                    justifyContent: "center",

                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="location-outline"
                    size={24}
                    color={theme.icon.default.icon}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <AppText variant="bodyLargeBold">Shipping Region</AppText>

                  <AppText
                    variant="bodySmall"
                    color="secondary"
                    style={{
                      marginTop: spacing.xs,
                    }}
                  >
                    Update the delivery area and shipping fee.
                  </AppText>
                </View>
              </View>

              {/* ==============================================================
                  REGION
              ============================================================== */}

              <Controller
                control={control}
                name="region"
                render={({ field, fieldState }) => (
                  <Input
                    label="Region"
                    required
                    placeholder="e.g. South West"
                    value={field.value}
                    error={fieldState.error?.message}
                    onChangeText={field.onChange}
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="next"
                    editable={!updateShippingRegionMutation.isPending}
                  />
                )}
              />

              {/* ==============================================================
                  STATE
              ============================================================== */}

              <Controller
                control={control}
                name="state"
                render={({ field, fieldState }) => (
                  <Input
                    label="State"
                    required
                    placeholder="e.g. Lagos"
                    value={field.value}
                    error={fieldState.error?.message}
                    onChangeText={field.onChange}
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="next"
                    editable={!updateShippingRegionMutation.isPending}
                  />
                )}
              />

              {/* ==============================================================
                  SHIPPING FEE
              ============================================================== */}

              <Controller
                control={control}
                name="shippingFee"
                render={({ field, fieldState }) => (
                  <Input
                    label="Shipping Fee"
                    required
                    placeholder="e.g. 3000"
                    value={field.value}
                    error={fieldState.error?.message}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    editable={!updateShippingRegionMutation.isPending}
                    onChangeText={(value) => {
                      const sanitized = value.replace(/[^0-9.]/g, "");

                      const decimalCount = sanitized.split(".").length - 1;

                      if (decimalCount > 1) {
                        return;
                      }

                      field.onChange(sanitized);
                    }}
                  />
                )}
              />
            </View>
          </Card>

          {/* ==================================================================
              SUPPORTING INFORMATION
          ================================================================== */}

          <View
            style={{
              flexDirection: "row",

              alignItems: "flex-start",

              gap: spacing.sm,

              marginTop: spacing.lg,

              padding: spacing.md,

              borderRadius: radius.md,

              backgroundColor: theme.background.subtle,
            }}
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={theme.icon.default.icon}
            />

            <AppText
              variant="bodySmall"
              color="secondary"
              style={{
                flex: 1,
              }}
            >
              The shipping fee is the delivery charge customers will pay when
              their delivery location matches this region.
            </AppText>
          </View>

          {/* ==================================================================
              SAVE
          ================================================================== */}

          <Button
            title={
              updateShippingRegionMutation.isPending
                ? "Saving..."
                : "Save Changes"
            }
            variant="primary"
            size="large"
            loading={updateShippingRegionMutation.isPending}
            disabled={
              updateShippingRegionMutation.isPending || !hasChanges || !isValid
            }
            onPress={() => {
              console.log("SAVE SHIPPING REGION PRESSED");

              console.log("FORM DIRTY:", isDirty);

              console.log("FORM VALID:", isValid);

              handleSubmit(handleUpdateShippingRegion, handleInvalidSubmit)();
            }}
            style={{
              marginTop: spacing.xl,
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
