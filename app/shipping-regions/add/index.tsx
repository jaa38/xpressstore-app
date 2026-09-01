import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { ScreenHeader } from "@/components/common/ScreenHeader";
import { AppText } from "@/components/ui/AppText";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import { useCreateShippingRegion } from "@/hooks/store/useCreateShippingRegion";
import { useToast } from "@/hooks/useToast";

import { spacing, theme } from "@/theme";

import { useState } from "react";

export default function AddShippingRegionScreen() {
  /**
   * ==========================================================================
   * STATE
   * ==========================================================================
   */

  const [region, setRegion] = useState("");
  const [state, setState] = useState("");
  const [shippingFee, setShippingFee] = useState("");

  const [regionError, setRegionError] = useState("");
  const [stateError, setStateError] = useState("");
  const [shippingFeeError, setShippingFeeError] = useState("");

  /**
   * ==========================================================================
   * MUTATION
   * ==========================================================================
   */

  const createShippingRegionMutation = useCreateShippingRegion();

  /**
   * ==========================================================================
   * TOAST
   * ==========================================================================
   */

  const { showToast } = useToast();

  /**
   * ==========================================================================
   * VALIDATION
   * ==========================================================================
   */

  function validate(): boolean {
    const trimmedRegion = region.trim();
    const trimmedState = state.trim();
    const trimmedShippingFee = shippingFee.trim();

    let valid = true;

    if (!trimmedRegion) {
      setRegionError("Region is required.");
      valid = false;
    } else {
      setRegionError("");
    }

    if (!trimmedState) {
      setStateError("State is required.");
      valid = false;
    } else {
      setStateError("");
    }

    if (!trimmedShippingFee) {
      setShippingFeeError("Shipping fee is required.");
      valid = false;
    } else {
      const parsedFee = Number(trimmedShippingFee);

      if (!Number.isFinite(parsedFee) || parsedFee < 0) {
        setShippingFeeError("Enter a valid shipping fee.");
        valid = false;
      } else {
        setShippingFeeError("");
      }
    }

    return valid;
  }

  /**
   * ==========================================================================
   * CREATE SHIPPING REGION
   * ==========================================================================
   */

  async function handleCreateShippingRegion() {
    if (createShippingRegionMutation.isPending) {
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      await createShippingRegionMutation.mutateAsync({
        region: region.trim(),
        state: state.trim(),
        shippingFee: Number(shippingFee.trim()),
      });

      showToast({
        type: "success",
        title: "Shipping Region Created",
        message: `${region.trim()} has been added.`,
      });

      router.back();
    } catch (error) {
      console.log("CREATE SHIPPING REGION ERROR", error);

      showToast({
        type: "error",
        title: "Unable to Create Shipping Region",
        message: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  /**
   * ==========================================================================
   * SCREEN
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
        <ScreenHeader title="Add Shipping Region" />

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.lg,
            paddingBottom: spacing["2xl"],
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
                marginTop: spacing.xs,
                textAlign: "left",
                maxWidth: 320,
              }}
            >
              Add a shipping region and set the delivery fee for customers in
              that area.
            </AppText>
          </View>

          {/* ==================================================================
              SHIPPING REGION INFORMATION
          ================================================================== */}

          <View
            style={{
              gap: spacing.lg,
            }}
          >
            {/* REGION */}

            <Input
              label="Region"
              required
              placeholder="e.g. South West"
              value={region}
              error={regionError}
              onChangeText={(value) => {
                setRegion(value);

                if (regionError) {
                  setRegionError("");
                }
              }}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              editable={!createShippingRegionMutation.isPending}
            />

            {/* STATE */}

            <Input
              label="State"
              required
              placeholder="e.g. Lagos"
              value={state}
              error={stateError}
              onChangeText={(value) => {
                setState(value);

                if (stateError) {
                  setStateError("");
                }
              }}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              editable={!createShippingRegionMutation.isPending}
            />

            {/* SHIPPING FEE */}

            <Input
              label="Shipping Fee"
              required
              placeholder="e.g. 3000"
              value={shippingFee}
              error={shippingFeeError}
              onChangeText={(value) => {
                const sanitized = value.replace(/[^0-9.]/g, "");

                const decimalCount = sanitized.split(".").length - 1;

                if (decimalCount > 1) {
                  return;
                }

                setShippingFee(sanitized);

                if (shippingFeeError) {
                  setShippingFeeError("");
                }
              }}
              keyboardType="decimal-pad"
              returnKeyType="done"
              editable={!createShippingRegionMutation.isPending}
            />
          </View>

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
              borderRadius: 12,
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
              CREATE BUTTON
          ================================================================== */}

          <Button
            title="Create Shipping Region"
            variant="primary"
            leftIcon={
              <Ionicons
                name="add"
                size={20}
                color={theme.action.primary.text}
              />
            }
            loading={createShippingRegionMutation.isPending}
            disabled={
              !region.trim() ||
              !state.trim() ||
              !shippingFee.trim() ||
              createShippingRegionMutation.isPending
            }
            style={{
              marginTop: spacing.xl,
            }}
            onPress={handleCreateShippingRegion}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
